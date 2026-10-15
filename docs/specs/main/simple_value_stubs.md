# Simple value stubs

## Provenance

- Target: `AS_EUR_REV2`
- Analyst observation date: 2026-10-15
- Evidence: direct-call targets in the privately held executable, independently inspected with Ghidra 12.0.2
- Instruction set: ARM
- Observed body size: 8 bytes each

No disassembly, target bytes, proprietary symbols, or SDK material are included in this specification.

## Behavioral specifications

The following routines return unsigned zero and have no other observable side effect:

- `func_002FF110`
- `func_0030F3A4`
- `func_004BCAFC`
- `func_004BCC40`
- `func_00507BA8`
- `func_00507BB0`

The following routines return signed negative one and have no other observable side effect:

- `func_00302274`
- `func_003022C0`
- `func_003022C8`
- `func_00503254`
- `func_0050326C`

`func_00462AF4` returns unsigned four and has no other observable side effect.

`func_00462C54` accepts one unsigned 32-bit value and returns that value plus four, with ordinary modulo-2^32 unsigned arithmetic and no other observable side effect.

`func_00503264` accepts three unsigned 32-bit values and returns the third value unchanged. It has no other observable side effect.

## Acceptance criteria

- Export every stable placeholder symbol listed above.
- Implement the behavior in portable C without inline assembly or embedded target bytes.
- Use explicit 32-bit integer types for parameters and return values.
- Compile as ARM code for ARMv6K with optimization enabled.
- Validate each routine independently with objdiff.
