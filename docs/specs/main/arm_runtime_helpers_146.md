# ARM runtime/helper batch 146

Source SHA-256: `fa1a567e0fba1fc5ee3674a9e43242e602333b63b1e5b7210ff2bf7fe6ae44ee`.

## Scope

This clean-room batch covers nine related unmatched ARMv6K object-access
helpers totaling 536 executable bytes and 134 instructions. Each helper first
requires the object stored through its incoming handle. Two helpers return a
flag byte; the other seven tail-transfer a caller-supplied destination and an
object-relative source address to a common copy routine.

The aggregate schedule contains 38 memory operations, nine local branches,
nine direct calls, seven direct tails, and two stack returns. It owns no
adjacent bytes and contains no literal pool, PC-relative data access, indirect
transfer, or embedded data.

## Boundary and behavior inventory

| Function | Bytes | Instructions | Transfer behavior |
| --- | ---: | ---: | --- |
| `func_004E8E58` | 48 | 12 | read the byte at object offset 342 and return |
| `func_004E8E88` | 60 | 15 | tail-copy from object offset 564 |
| `func_004E8F98` | 64 | 16 | tail-copy from object offset 538 |
| `func_004E9094` | 64 | 16 | tail-copy from object offset 666 |
| `func_004E90D4` | 60 | 15 | tail-copy from object offset 632 |
| `func_004E9178` | 60 | 15 | tail-copy from object offset 700 |
| `func_004E91B4` | 64 | 16 | tail-copy from object offset 734 |
| `func_004E91F4` | 64 | 16 | tail-copy from object offset 598 |
| `func_004E9234` | 52 | 13 | read bit zero of the byte at object offset 343 and return |

Each body occupies one 4-byte-aligned `.text.<function>` AX PROGBITS section.
The global function symbol spans exactly the stated body, with one ARM mapping
symbol at offset zero. Public gaps through each declared next global symbol
are excluded; six owned bodies end exactly at their next global boundary.

## Transfer contract

Every helper has one ordered `R_ARM_CALL` relocation to `func_0011EF4C` on
its null-object path. The seven copy helpers additionally have one ordered
`R_ARM_JUMP24` relocation to `func_003A5C74` after restoring their saved
registers. Each helper has exactly one local conditional branch around the
null-object call. Thus the object contains exactly nine calls and seven tails
to two public undefined identities, with no other relocation or global
identity.

## Implementation and validation contract

- Preserve all 134 instruction words, function boundaries, section order,
  registers, immediate values, conditions, field widths and offsets, nine
  local branches, seven direct tails, and two returns.
- Emit exactly nine ordered `R_ARM_CALL` relocations to `func_0011EF4C` and
  seven ordered `R_ARM_JUMP24` relocations to `func_003A5C74`; emit no other
  relocation or global identity.
- Emit no adjacent payload, literal pool, PC-relative data access, indirect
  transfer, embedded data, or foreign executable section.
- Keep every owned interval disjoint from every recursively discovered public
  source and configuration owner.
- Pin the complete source and configuration; validate bounded ELF metadata,
  exact body hashes and words, mapping/function symbols, both relocation
  schedules, manifest totals, and aggregate control flow.
- When an authoritative target object is supplied, resolve every branch from
  its public neutral address and require every resulting body byte to equal
  the corresponding target section.
- The hostile self-test must reject every single instruction-word mutation,
  call and tail relocation-type swaps, relocation offset/identity mutations,
  section growth, wrong machine, truncation, and oversize input, while
  accepting a bounded composite with 12,000 unrelated empty executable
  sections.

The source, configuration, validator, and specification contain only authored
assembly and neutral metadata. No target object, extracted game payload,
asset, private path, CRO payload, or generated executable artifact is included.
