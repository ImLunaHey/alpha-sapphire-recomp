# Thumb leaf/helper batch 22

## Scope and provenance

This batch owns `func_002FFB14` for revision `AS_EUR_REV2`. The candidate was
selected by reconciling the authoritative unmatched-function report and target
symbol metadata against every public configuration owner. Three unowned,
unmatched Thumb primaries no larger than 256 bytes remained. This 118-byte
helper was selected because its complete owned section is continuous Thumb
code and its references beyond the body can be represented without acquiring
the referenced bytes.

The smaller 88-byte `func_00100134` was withheld: its target section combines
Thumb instructions, an interior literal interval, and an ARM interworking
stub, so it is not a continuous Thumb leaf/helper interval. The remaining
148-byte `func_003027AE` was not transferred into this batch. Recursive public
ownership inspection found no existing owner or duplicate-body claim for the
selected function.

## Structural inventory and ABI

| Function | Body bytes | Instructions | Wide | Local branches | Memory ops | Returns | Direct calls | Legacy no-ops | Next global |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `func_002FFB14` | 118 | 56 | 3 | 5 | 11 | 2 | 3 | 2 | `func_002FFB94` (+0x80) |

The helper preserves `r3` through `r7` and `lr`. It bounds two input lengths,
using the external diagnostic helper when either exceeds the accepted range,
then conditionally allocates and initializes a small three-word header and its
trailing byte interval. The zero-length path returns a referenced external
word. Both exits restore the same saved register set and return through `pc`.

The two historical no-operations at +0x44 and +0x66 are high-register
self-copies. They are encoding-significant and remain distinct from the dead
immediate assignments immediately before them.

## Calls, relocations, and external identities

| Site | Destination | State | Entry-relative target | Linked halfwords |
| ---: | --- | --- | ---: | --- |
| +0x18 | `func_00300ABC` | Thumb | +0xfa8 | `f000 ffc6` |
| +0x2a | `func_00300ABC` | Thumb | +0xfa8 | `f000 ffbd` |
| +0x38 | `thumb_secondary_00102024` | Thumb | -0x1fdaf0 | `f602 fa6a` |

Each call is four bytes and carries one ELF REL `R_ARM_THM_CALL` relocation
with implicit addend -4. The first two relocations deliberately reuse the
same undefined function identity; the third uses a distinct undefined
secondary-entry identity. No call changes instruction state and no other
relocation is permitted.

`func_00300ABC` is the public primary owned by
`config/thumb-leaf-helpers-21.json`. `thumb_secondary_00102024` names an
unowned Thumb entry 20 bytes after the end of `func_00102008` and 34 bytes
before `func_00102046`. The identity supplies linkage only and transfers no
destination bytes.

## PC-relative references and ownership

Four two-byte PC-relative address calculations at +0x14, +0x16, +0x24, and
+0x26 all resolve to body-relative +0x78. Their immediate displacements are
96, 96, 80, and 80. The word load at +0x72 uses displacement 8 and resolves
to body-relative +0x7c. All five encodings require the function entry address
modulo four to equal zero.

The owned body ends at +0x76. Consequently, +0x78 and +0x7c are references
into the ten-byte gap before `func_002FFB94` at +0x80; neither referenced
location belongs to this batch. The implementation encodes the resolved PC
immediates directly and emits no literal pool, referenced value, relocation,
padding, or other adjacent byte.

## Control flow and encoding constraints

The five local transfers are narrow conditional Thumb branches:

| Site | Condition | Destination |
| ---: | --- | ---: |
| +0x0c | unsigned lower-or-same | +0x1c |
| +0x1e | unsigned lower-or-same | +0x2e |
| +0x30 | equal | +0x72 |
| +0x4a | equal | +0x52 |
| +0x6a | equal | +0x6e |

All local transfers are resolved and emit no relocation. Low-register copies,
adds, and complement operations retain their flag-setting two-byte forms. The
stack-pointer copy at +0x5c remains the non-flag-setting high-register form.
The legacy no-ops remain `mov r8, r8`, not another architectural no-op.

The object is ELF32 little-endian `ET_REL` for `EM_ARM` with EABI5 flags. Its
single nonempty executable section has alignment two, begins with one `$t`
mapping symbol, exports one default-visible Thumb function with symbol value
one, and ends at byte 118. Attributes identify ARMv6K, Thumb-1, and VFPv2.
Exactly two undefined function symbols and three SHT_REL call relocations are
present. SHT_RELA, ARMv7 attributes, aliases, dynamic symbols, interior data
mapping, adjacent ownership, and extra executable bytes are forbidden.

## Authoritative byte audit

The standalone source produces the complete 118-byte semantic body, with the
three call fields holding their canonical REL implicit addend. Applying the
recorded call destinations produces the authoritative target call encodings
listed above. The resulting full linked body is byte-identical to the target
section. Its SHA-256 digest is pinned by the validator, as are the complete
relocatable body, raw configuration, normalized configuration, source, and
this specification.

Independent validation must check all 56 contiguous semantic rows, the exact
118-byte section boundary, continuous Thumb mapping, the entry modulo-four
requirement, five local branches, eleven memory operations, two returns,
three direct calls, two legacy no-ops, symbol metadata, and exactly three call
relocations. It must reject any claimed byte at +0x76 or later.

Validation is bounded to 64 MiB of complete input, 16 MiB of aggregate
executable section data, 16,384 sections, 1,000,000 symbols across `SYMTAB`
and `DYNSYM`, and 1,000,000 relocations. Each limit rejects independently.

## Implementation checklist

- Implement only `src/main/thumb_leaf_helpers_22.S` from the ordered semantic
  rows in `config/thumb-leaf-helpers-22.json`.
- Use `.arch armv6k`, `.fpu vfpv2`, `.thumb`, and a dedicated two-byte-aligned
  executable section while preserving entry address modulo four equal to zero.
- Express all three external calls symbolically so the assembler emits the
  exact `R_ARM_THM_CALL` relocations and canonical REL addends.
- Define the secondary destination only as an undefined function symbol.
- Encode the four PC-relative addresses and one literal load without emitting
  their referenced bytes.
- Preserve every narrow form, local destination, dead assignment, and legacy
  high-register no-operation.
- Do not emit raw data directives or claim any byte outside the 118-byte body.
