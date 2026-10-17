# ARM runtime/helper batch 139

Source SHA-256: `6fd2183841c030180c064facc8e00570da2542c32dc97fad9fc4bb4b8bbc0c7f`.

## Scope

This clean-room batch covers 18 ARMv6K functions totaling 712 executable
bytes and 178 instructions. The functions are small object accessors,
state updates, relative-pointer adapters, and virtual-dispatch wrappers.
Their public contract is fully described by the checked-in source,
configuration, and validator; no target bytes, private disassembly, literal
payload, or adjacent data is part of this specification.

The complete transfer schedule contains 13 local branches, four indirect
calls, 16 indirect tails, and ten register-return instructions. There are no
direct calls or tails, relocations, PC-relative data accesses, literal pools,
or owned post-body bytes.

## Boundary inventory

| Function | Bytes | Instructions |
| --- | ---: | ---: |
| `func_0010B994` | 32 | 8 |
| `func_0011ECE4` | 44 | 11 |
| `func_0013335C` | 36 | 9 |
| `func_0018F3E0` | 24 | 6 |
| `func_0021A9C0` | 20 | 5 |
| `func_002A59CC` | 32 | 8 |
| `func_002AE09C` | 20 | 5 |
| `func_002AE0B0` | 20 | 5 |
| `func_003118EC` | 96 | 24 |
| `func_00313BB8` | 72 | 18 |
| `func_0033D5DC` | 20 | 5 |
| `func_003AAF90` | 56 | 14 |
| `func_003BB634` | 44 | 11 |
| `func_004BCB04` | 60 | 15 |
| `func_004BEBB0` | 12 | 3 |
| `func_004BFE6C` | 28 | 7 |
| `func_004C8814` | 72 | 18 |
| `func_004C8DEC` | 24 | 6 |

Each body occupies one 4-byte-aligned `.text.<function>` AX PROGBITS section.
The global function symbol spans exactly the stated body, with one ARM mapping
symbol at offset zero and no adjacent ownership.

## Dispatch and control-flow contract

The direct local branches and their target offsets are pinned in
`config/arm-runtime-helpers-139.json`. The indirect calls occur in
`func_003118EC`, `func_00313BB8`, `func_003BB634`, and `func_004BCB04`.
The 16 indirect tails preserve their specified dispatch slot and transfer
register; they must not be rewritten as direct branches or calls.

`func_003118EC` and `func_00313BB8` resolve nullable relative pointers before
calling and tail-dispatching through slot 12. The remaining wrappers perform
the exact field loads, stores, comparisons, argument reshaping, and virtual
slot selection encoded by the public source. In particular, the flag-setting
entry calculation in `func_004C8814` and all conditional return paths are part
of the instruction schedule.

## Implementation and validation contract

- Preserve the source’s exact instruction words, register allocation,
  condition codes, branch destinations, transfer offsets, function sizes, and
  section order.
- Emit exactly 18 global ARM function definitions and no extra global or
  named local identities.
- Emit no relocation section, direct transfer, literal pool, PC-relative data
  access, padding, or adjacent payload.
- Keep all owned intervals disjoint from every other configured source owner.
- Pin both source and configuration hashes and validate every instruction
  word, body hash, section boundary, symbol span, ARM mapping symbol, and
  aggregate control-flow count.
- The validator must reject instruction, section, symbol, relocation, mode,
  truncation, ownership, and metadata mutations, and accept a bounded
  composite containing 12,000 unrelated empty executable sections.
