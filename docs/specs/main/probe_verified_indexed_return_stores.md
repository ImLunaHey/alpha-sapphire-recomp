# Probe-verified indexed stores with constant returns

## Provenance

- Target: `AS_EUR_REV2`
- Analyst observation date: 2026-10-15
- Evidence: conservative direct-call function boundaries in the privately held executable, independently inspected with Ghidra 12.0.2
- Validation: temporary portable-C probes compiled with GCC 15 for ARMv6K ARM mode produced byte-exact function bodies

No disassembly, target bytes, proprietary symbols, or SDK material are included in this specification.

## Shared contract

Each routine accepts an unsigned address-sized byte offset as its first argument and a writable byte pointer as its second argument. Pointer arithmetic is valid only when the resulting address remains within the caller-provided object. Neither routine reads memory or accesses any location other than the single byte stated below.

## Routines

- `func_00407CF0(offset, base)`
  - Instruction mode: ARM.
  - Target size: 16 bytes.
  - Add `offset` bytes to `base`, store byte zero at a further offset of 300, then return unsigned 32-bit zero.
  - The stored value is exactly an unsigned 8-bit zero.
  - Probe status: byte-exact with the current GCC 15 ARMv6K toolchain.

- `func_0045CCA4(offset, base)`
  - Instruction mode: ARM.
  - Target size: 16 bytes.
  - Add `offset` bytes to `base`, store byte one at a further offset of 4, then return unsigned 32-bit one.
  - The stored value is exactly an unsigned 8-bit one.
  - Probe status: byte-exact with the current GCC 15 ARMv6K toolchain.

## Ordering and side effects

For each routine, the byte store is completed before the constant result is returned. The routines perform no other observable side effect. The offset is unsigned and is measured in bytes; there is no scaling, sign extension, masking, or saturation.

## Acceptance criteria

- Implement both routines in portable C using `uintptr_t`, `uint8_t`, and `uint32_t` or equivalent fixed-width types.
- Preserve the argument order above: unsigned byte offset first, writable byte pointer second.
- Do not use inline assembly, embedded target bytes, proprietary names, or SDK declarations.
- Compile as ARM code for ARMv6K with optimization enabled and validate each routine independently with objdiff.
