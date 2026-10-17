# Thumb leaf/helper batch 23

## Scope and selection

This batch owns `func_003027AE` for `AS_EUR_REV2`. The authoritative unmatched
report and symbol inventory were reconciled against all public configuration
owners. The selected 148-byte function is an unowned primary with one
continuous Thumb mapping interval, no interior data, and no whole-body peer.

The smaller unmatched `func_00100134` remains withheld because its 88-byte
target section mixes Thumb instructions, literal data, and an ARM interworking
stub. Larger candidates were not transferred into this batch.

## Structural contract

| Function | Bytes | Instructions | Wide | Branches | Memory ops | Returns | Calls | Legacy no-ops | Next global |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `func_003027AE` | 148 | 65 | 9 | 10 | 10 | 1 | 9 | 4 | `func_003028B8` (+0x10a) |

The entry address is two modulo four. The helper saves `r3` through `r7` and
`lr`, tests five bits from its second argument, and conditionally constructs
or retrieves five external values. Successful values are installed into
successive fields reached through `func_002FF7EC`. The final common action
calls `func_003026AC`; every failed construction branches directly to the
common return.

Four historical no-operations at +0x48, +0x4a, +0x7c, and +0x7e are exact
high-register `mov r8, r8` encodings. The increment at +0x1e is the
three-operand immediate form; the source uses `.inst.n 0x1c7f` because the
assembler otherwise selects the distinct two-operand encoding.

## Calls and relocations

| Site | Destination | State | Entry-relative target |
| ---: | --- | --- | ---: |
| +0x12 | `func_0016F3FC` | ARM | -0x1933b2 |
| +0x1a | `func_002FF7EC` | ARM | -0x2fc2 |
| +0x2e | `func_0052AEC4` | ARM | +0x228716 |
| +0x36 | `func_002FF7EC` | ARM | -0x2fc2 |
| +0x50 | `func_002FF7EC` | ARM | -0x2fc2 |
| +0x62 | `func_00193C20` | ARM | -0x16eb8e |
| +0x6a | `func_002FF7EC` | ARM | -0x2fc2 |
| +0x84 | `func_002FF7EC` | ARM | -0x2fc2 |
| +0x8e | `func_003026AC` | Thumb | -0x102 |

Each call has exactly one ELF REL `R_ARM_THM_CALL` relocation with implicit
addend -4. The first eight sites are explicit `blx` transfers to ARM; the last
is a `bl` transfer that remains Thumb. The five distinct destinations are
undefined default-visible function symbols. `func_0016F3FC`,
`func_0052AEC4`, and `func_00193C20` are public owners in duplicate-template
batch 73; `func_003026AC` is public in Thumb batch 14. `func_002FF7EC` is an
unowned ARM primary and supplies linkage identity only.

## PC-relative reference and ownership

The literal loads at +0x0c, +0x26, +0x40, +0x5a, and +0x74 carry immediate
displacements 140, 112, 88, 60, and 36. Because the function entry is two
modulo four, all five address the same word at body-relative +0x9a. Section-
relative disassembly at address zero misleadingly prints alternating +0x98
and +0x9c; those are not the placement contract.

The body ends at +0x94, so the referenced word begins six bytes after the
owned interval. The next global starts at +0x10a. The implementation emits no
literal pool, referenced word, relocation, padding, or other byte beyond the
148-byte body.

## Object and validation contract

The object is ELF32 little-endian `ET_REL` for `EM_ARM`, with EABI5 flags and
ARMv6K, Thumb-1, and VFPv2 attributes. Its sole nonempty executable section
has alignment two, one `$t` mapping symbol, one default-visible Thumb primary
whose value is one, five undefined function symbols, and exactly nine SHT_REL
call relocations. SHT_RELA, dynamic symbols, aliases, extra executable bytes,
interior data mapping, and adjacent ownership are forbidden.

Validation pins the raw and normalized configuration, source, specification,
relocatable body, and linked body. It reconstructs every linked BL/BLX field
from its site, state, target, and the required entry modulo-four value, then
compares all 148 bytes with the authoritative target section. Parsing is
bounded to 64 MiB of input, 16 MiB of executable data, 16,384 sections,
1,000,000 symbols, and 1,000,000 relocations.

Hostile tests must independently reject oversized resource counters,
truncated section tables, unterminated strings, out-of-range section data,
invalid relocation symbol indices, an added executable byte, mutated mapping
or primary symbols, RELA substitution, instruction mutation, relocation
mutation, and attribute mutation.

## Implementation checklist

- Keep `.arch armv6k`, `.fpu vfpv2`, `.thumb`, and a dedicated alignment-two
  executable section placed at an address two modulo four.
- Preserve all narrow forms, branch destinations, four legacy no-ops, and the
  forced three-operand increment.
- Express all calls symbolically with the recorded BL/BLX state behavior.
- Encode the five literal loads directly without owning their common target.
- Emit no raw data and claim no byte outside the 148-byte function body.
