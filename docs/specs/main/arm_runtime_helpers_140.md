# ARM runtime/helper batch 140

Source SHA-256: `068b1d48f8042b56b6d144beb743320dd1ac74009f244fc5c97ecf839d0d44ed`.

## Scope

This clean-room batch covers 16 related ARMv6K lookup wrappers totaling 640
executable bytes and 160 instructions. Each wrapper prepares a stack result
slot, selects a fixed lookup width, optionally adjusts its receiver, calls the
shared public identity `func_0017D058`, then normalizes the result or supplies
a fixed failure value.

The aggregate schedule contains 48 memory operations, seven local branches,
16 direct calls, and 16 stack returns. It owns no adjacent bytes and contains
no literal pool, PC-relative data access, indirect call, indirect tail, or
direct tail.

## Boundary and lookup inventory

| Function | Bytes | Instructions | Selector | Receiver adjustment |
| --- | ---: | ---: | ---: | ---: |
| `func_004BEE80` | 36 | 9 | 2 | 0 |
| `func_004BEFC8` | 40 | 10 | 2 | 0 |
| `func_004BEFF0` | 40 | 10 | 2 | 0 |
| `func_004BF018` | 40 | 10 | 0 | 0 |
| `func_004BF040` | 36 | 9 | 0 | 0 |
| `func_004BFA4C` | 32 | 8 | 2 | 24 |
| `func_004BFA6C` | 32 | 8 | 1 | 24 |
| `func_004BFA8C` | 40 | 10 | 0 | 24 |
| `func_004BFAD0` | 52 | 13 | 0 | 24 |
| `func_004BFB28` | 40 | 10 | 8 | 20 |
| `func_004C1F5C` | 44 | 11 | 4 | 4 |
| `func_004C1FC4` | 40 | 10 | 0 | 4 |
| `func_004C1FEC` | 44 | 11 | 4 | 4 |
| `func_004C2030` | 44 | 11 | 4 | 4 |
| `func_004C205C` | 40 | 10 | 2 | 4 |
| `func_004C20F8` | 40 | 10 | 1 | 4 |

Each body occupies one 4-byte-aligned `.text.<function>` AX PROGBITS section.
The global function symbol spans exactly the stated body, with one ARM mapping
symbol at offset zero and no adjacent ownership.

## Call and result contract

Every function has exactly one `bl func_0017D058`, represented by an ordered
`R_ARM_CALL` relocation. All 16 relocations reuse that single undefined global
identity. The wrappers preserve their configured selector and receiver
adjustment, including the unadjusted group, the `+24`, `+20`, and `+4` groups,
and the distinct result conversions and failure constants shown in the public
source.

Seven wrappers use a local conditional branch to their final `pop ... pc`.
The other wrappers use conditional loads, masks, moves, or additions without
introducing another branch. Each function has exactly one stack-return site.

## Implementation and validation contract

- Preserve all 160 instruction words, register choices, conditions, stack
  layouts, local branch targets, selectors, receiver adjustments, result
  conversions, failure constants, function boundaries, and section order.
- Emit exactly 16 ordered `R_ARM_CALL` relocations to `func_0017D058`, with no
  other relocation or global identity.
- Emit no indirect transfer, direct tail, literal pool, PC-relative data
  access, padding, or adjacent payload.
- Keep all owned intervals disjoint from every other configured source owner.
- Pin source and normalized configuration hashes and validate body hashes,
  section metadata, symbol spans, ARM mapping symbols, relocation sites and
  identity, and aggregate instruction, memory, branch, call, and return counts.
- The validator must reject instruction, relocation, section, symbol, mode,
  truncation, ownership, and metadata mutations, and accept a bounded
  composite containing 12,000 unrelated empty executable sections.
