# Thumb leaf/helper batch 26

## Scope

This batch owns only `func_002FF3AE` at `0x002FF3AE`. Its authoritative
section is 410 bytes of continuously mapped Thumb code and has no public
owner or whole-body duplicate. The mixed Thumb/data/ARM section
`func_00100134` remains withheld.

## Structural contract

| Function | Bytes | Instructions | Wide | Branches | Memory ops | Returns | Calls | Next global |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `func_002FF3AE` | 410 | 198 | 7 | 35 | 62 | 1 | 7 | `func_002FF7C0` (+0x412) |

The helper converts and formats a two-word numeric value into a supplied byte
buffer. It uses a 76-byte stack frame, selects signed/unsigned arithmetic
helpers, emits digits, conditionally reverses them, and records the result.

## Calls and relocations

| Site | Destination | State | Target offset |
| ---: | --- | --- | ---: |
| +0x1a | `func_002FF110` | ARM | -0x29e |
| +0xa2 | `func_002FF118` | Thumb | -0x296 |
| +0xb2 | `arm_secondary_001947E8` | ARM | -0x16abc6 |
| +0xd6 | `func_002FF1EC` | ARM | -0x1c2 |
| +0xe8 | `func_002FF21C` | ARM | -0x192 |
| +0x112 | `func_002FF24C` | ARM | -0x162 |
| +0x142 | `func_002FF24C` | ARM | -0x162 |

Each site has one ELF REL `R_ARM_THM_CALL` relocation with implicit addend
-4. Six sites are `blx` state switches and one is a Thumb `bl`. The secondary
ARM identity is exactly the end of `func_001947D8`; it owns no bytes.

## Distant literals and ownership

The loads at +0x46, +0x48, +0xba, and +0xc6 resolve, for entry modulo four
two, to +0x406, +0x40a, +0x40e, and +0x40e. These are the final three words
of the 632-byte gap after the body. The final word ends exactly where
`func_002FF7C0` begins at +0x412. The source deliberately emits no pool,
padding, relocation, or other adjacent byte.

## Object and validation contract

All 35 local transfers remain narrow and resolved. The object is ELF32
little-endian ARM EABI5 for ARMv6K, Thumb-1, and VFPv2. Its sole nonempty
executable section is 410 bytes, aligned two, with one `$t` mapping, one Thumb
primary, six unique undefined function identities, and seven SHT_REL call
relocations. RELA, aliases, dynamic symbols, extra executable bytes, and
interior mapping changes are forbidden.

Validation pins raw and normalized configuration, source, specification,
relocatable bytes, and all authoritative linked bytes. It also audits public
ownership and exact-body uniqueness. Parsing is capped at 64 MiB input,
16 MiB executable data, 16,384 sections, and 1,000,000 symbols or relocations.
Hostile tests cover all caps, malformed/truncated tables and strings, invalid
relocation symbols, RELA substitution, instruction/attribute/symbol/mapping
mutation, and executable growth beyond +0x19a.
