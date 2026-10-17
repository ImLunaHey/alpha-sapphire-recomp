# Thumb leaf/helper batch 24

## Scope and selection

This batch owns `func_002FEE54` for `AS_EUR_REV2`. The authoritative unmatched
report and target symbols were reconciled against every public configuration.
The selected 388-byte primary has a single continuous Thumb mapping, no
interior data, no existing public owner, and no exact whole-body peer.

The smaller `func_00100134` remains withheld because its section mixes Thumb
instructions, literal data, and ARM code. No mixed-state or ambiguous interval
was transferred.

## Structural contract

| Function | Bytes | Instructions | Wide | Local branches | Memory ops | Returns | Direct calls | Indirect calls | Next global |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `func_002FEE54` | 388 | 191 | 3 | 46 | 35 | 1 | 3 | 8 | `func_002FEFDC` (+0x188) |

The helper is a format-parser and dispatcher. It maintains a consumed-item
count at object offset 32, repeatedly reads input through the callback at
offset 12, parses flags and two width fields, normalizes length modifiers and
case, then invokes either the supplied object callback or an external
state-switching dispatcher. The stack carries the incoming cursor and a
temporary field pointer. The single exit returns the consumed count.

## Calls and relocations

| Site | Destination | State | Entry-relative target |
| ---: | --- | --- | ---: |
| +0x58 | `func_002FFB94` | Thumb | +0xd40 |
| +0xa8 | `func_002FFB94` | Thumb | +0xd40 |
| +0x146 | `arm_secondary_00106078` | ARM | -0x1f8ddc |

All three sites carry ELF REL `R_ARM_THM_CALL` relocations with implicit
addend -4. The first two are `bl` calls to the public Thumb primary owned by
`config/thumb-leaf-helpers-01.json`. The final site is an explicit `blx` call
to an unowned ARM secondary entry at `0x00106078`, between the end of
`func_00105FEA` and the following ARM global `func_001063A0`. That secondary
identity transfers no destination bytes.

The eight register-indirect calls occur at +0x0e, +0x28, +0x7c, +0xa4,
+0xbc, +0x102, +0x118, and +0x176. They emit no relocations and derive state
from bit zero.

## PC-relative reference and ownership

The word load at +0x1e uses displacement 356. With the required entry address
modulo four equal to zero, it addresses body-relative +0x184, exactly the end
of the owned body. The referenced word occupies the complete four-byte gap
before `func_002FEFDC` at +0x188. It remains unowned: the source emits neither
the word nor literal-pool data, relocation, padding, or any adjacent byte.

## Encoding and object contract

All 46 local branches are narrow resolved Thumb transfers. Four additions at
+0xc4, +0x152, +0x16a, and +0x17a use encoding-sensitive three-operand
immediate forms and are emitted explicitly where GNU assembly selection would
otherwise choose a different two-byte encoding. There are no legacy no-ops.

The object is ELF32 little-endian `ET_REL` for `EM_ARM`, with EABI5 flags and
ARMv6K, Thumb-1, and VFPv2 attributes. Its only nonempty executable section
has alignment two, a single `$t` mapping symbol, one default-visible Thumb
primary with value one, two undefined function symbols, and exactly three
SHT_REL call relocations. SHT_RELA, dynamic symbols, aliases, extra executable
bytes, interior data mapping, and adjacent ownership are forbidden.

## Validation requirements

Validation pins the raw and normalized configuration, source, specification,
complete relocatable instruction body, and authoritative linked body. It
reconstructs both Thumb calls and the ARM-state-switching call from their
sites and entry-relative destinations, then compares all 388 linked bytes to
the authoritative target section.

The parser is bounded to 64 MiB input, 16 MiB executable data, 16,384
sections, 1,000,000 symbols, and 1,000,000 relocations. Hostile tests reject
each resource cap independently, truncated tables, unterminated strings,
out-of-range section data, invalid relocation symbol indices, RELA
substitution, symbol/mapping mutations, instruction and attribute mutations,
and any executable byte added at or after +0x184.

## Implementation checklist

- Preserve `.arch armv6k`, `.fpu vfpv2`, `.thumb`, alignment two, and entry
  placement modulo four equal to zero.
- Preserve every local destination, indirect target register, and narrow form.
- Express all three external calls symbolically with their recorded states.
- Encode the +0x184 reference directly without owning its word.
- Emit no data or byte outside the exact 388-byte body.
