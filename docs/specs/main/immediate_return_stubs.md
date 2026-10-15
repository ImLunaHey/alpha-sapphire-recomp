# Immediate-return stubs

## Provenance

- Target: `AS_EUR_REV2`
- Analyst observation date: 2026-10-15
- Evidence: direct-call targets in the privately held executable, independently inspected with Ghidra 12.0.2
- Instruction set: ARM
- Observed body size: 4 bytes each

No disassembly, target bytes, proprietary symbols, or SDK material are included in this specification.

## Stable placeholder symbols

- `func_00258368`
- `func_0028F218`
- `func_00293BD8`
- `func_00302328`
- `func_00303D98`
- `func_0030FF24`
- `func_0031069C`
- `func_00311080`
- `func_00372704`
- `func_003A7EA8`
- `func_003B6804`
- `func_003B6808`
- `func_003B6958`
- `func_003B695C`
- `func_003B6B38`
- `func_00479BEC`
- `func_0056DC50`

## Behavioral specification

Each routine returns immediately to its caller. None accesses memory, calls another routine, alters argument/result registers, or produces an observable side effect. The original high-level signatures cannot be established from this behavior alone; use parameterless `void` placeholders until call-site analysis supplies stronger type evidence.

## Acceptance criteria

- Export every stable placeholder symbol listed above.
- Implement the behavior in portable C without inline assembly or embedded target bytes.
- Compile as ARM code for ARMv6K with optimization enabled.
- Validate each routine independently with objdiff.
