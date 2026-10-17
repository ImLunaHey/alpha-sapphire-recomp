# Thumb leaf/helper batch 25

## Scope and selection

This batch owns only `func_00302452` for `AS_EUR_REV2`. The authoritative
section is 486 bytes of continuously mapped Thumb code with no interior data
mapping and no prior public owner. `func_002FF3AE` was withheld because its
PC-relative references cross later text ownership; `func_00100134` remains
withheld because it mixes Thumb code, literal data, and ARM code.

## Structural contract

| Function | Bytes | Instructions | Wide | Local branches | Memory ops | Returns | Direct calls | Next global |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `func_00302452` | 486 | 232 | 11 | 30 | 83 | 5 | 11 | `func_003026AC` (+0x25a) |

The helper mutates a state object, normalizes flags and cursor fields, invokes
allocation/copy/cleanup helpers as required, and has five stack-restoring
returns. It has no register-indirect calls or tail calls.

## Calls and relocations

| Site | Destination | State | Entry-relative target |
| ---: | --- | --- | ---: |
| +0x40 | `func_00301DC8` | Thumb | -0x68a |
| +0x50 | `func_00301D1C` | Thumb | -0x736 |
| +0xa4 | `func_002FECF8` | ARM | -0x375a |
| +0xda | `func_00301D7C` | Thumb | -0x6d6 |
| +0x104 | `func_003022C8` | ARM | -0x18a |
| +0x12c | `func_00301D7C` | Thumb | -0x6d6 |
| +0x138 | `func_003022C8` | ARM | -0x18a |
| +0x160 | `func_00301D7C` | Thumb | -0x6d6 |
| +0x18a | `func_00103568` | Thumb | -0x1feeea |
| +0x1b0 | `func_003023F0` | Thumb | -0x62 |
| +0x1e0 | `func_0030242A` | Thumb | -0x28 |

Every site carries exactly one ELF REL `R_ARM_THM_CALL` relocation with
implicit addend -4. The three `blx` sites preserve ARM state; the other eight
preserve Thumb state. Destination identities transfer no destination bytes.

## PC-relative references and ownership

The literal loads at +0x0a, +0x44, and +0x76 use displacements 472, 420, and
372. At the required entry address modulo four of two, their aligned-PC bases
resolve to body-relative +0x1e6, +0x1ea, and +0x1ee. These three words lie in
the 116-byte unowned gap before `func_003026AC` at +0x25a. The source emits no
literal pool, padding, relocation, or adjacent byte.

## Encoding and object contract

All 30 local transfers are narrow and resolved. Encoding-sensitive
three-operand immediate forms at +0x6e, +0x1b4, +0x1c0, and +0x1c4 are emitted
explicitly. There are no legacy no-ops.

The object is ELF32 little-endian `ET_REL` for `EM_ARM`, EABI5, ARMv6K,
Thumb-1, and VFPv2. Its only nonempty executable section is exactly 486 bytes,
aligned to two, with one `$t` mapping symbol and one default-visible Thumb
primary. It has eight unique undefined function identities and exactly eleven
SHT_REL call relocations. RELA, aliases, dynamic symbols, extra executable
bytes, interior mapping changes, and adjacent ownership are forbidden.

## Validation requirements

Validation pins raw and normalized configuration, source, specification,
relocatable bytes, and authoritative linked bytes. It reconstructs all eleven
calls using entry modulo four two and compares the entire linked body to the
target section. A public ownership scan rejects any second primary owner.

The parser caps complete input at 64 MiB, executable bytes at 16 MiB, section
count at 16,384, and symbols and relocations at 1,000,000 each. Hostile tests
reject every cap, truncated or out-of-range tables, unterminated strings,
invalid relocation symbols, RELA substitution, instruction/attribute/symbol/
mapping mutation, and executable growth beyond +0x1e6.

## Implementation checklist

- Preserve `.arch armv6k`, `.fpu vfpv2`, Thumb mode, alignment two, and entry
  placement modulo four equal to two.
- Preserve every narrow local destination and exact instruction encoding.
- Express all eleven calls symbolically with the recorded destination state.
- Keep the three post-body words and every other adjacent byte unowned.
