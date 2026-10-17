# DllBattle record operations 04

This batch reconstructs 13 public ARM functions in `cro/DllBattle` for
`AS_EUR_REV2`, totaling 884 executable bytes and 221 instructions. The authored
source has no calls, relocations, literal pools, target payload, strings,
assets, allocated data, or adjacent-byte ownership.

| Function | Address | Bytes | Contract |
| --- | ---: | ---: | --- |
| `func_0001E234` | `0x0001E234` | 32 | increment a counter while excluding zero on wrap |
| `func_0004FD4C` | `0x0004FD4C` | 40 | read a byte from bounded inline or external storage |
| `func_000599A4` | `0x000599A4` | 96 | locate a keyed list record and return one field |
| `func_0005DAD4` | `0x0005DAD4` | 96 | locate a keyed list record and return its paired field |
| `func_0005DE8C` | `0x0005DE8C` | 72 | update flags across six optional records |
| `func_0005F23C` | `0x0005F23C` | 52 | swap two indexed records and their nested fields |
| `func_00062F40` | `0x00062F40` | 60 | copy two optional record fragments |
| `func_0006F094` | `0x0006F094` | 80 | clear a fixed ten-entry record |
| `func_00070AB0` | `0x00070AB0` | 48 | normalize selected fields in one packed word |
| `func_00075C14` | `0x00075C14` | 92 | reset one indexed record and five paired slots |
| `func_00075C70` | `0x00075C70` | 84 | clear either one requested record or a bounded suffix |
| `func_0007A000` | `0x0007A000` | 76 | initialize a packed record while preserving one field |
| `func_000AAF60` | `0x000AAF60` | 56 | read and conditionally clear nested record state |

Each body is four-byte aligned and owns exactly one `.text.<function>` section,
one ARM mapping symbol, and one global function symbol. The batch exports no
other identity and allocates no non-code section.

The pinned manifest records exact neutral boundaries, the source hash, authored
body hashes, semantic labels, aggregate counts, and resource limits. The batch
validator selects the shared strict DllBattle ELF gate: it checks the public
inventory, disjoint source/config ownership, forbidden source directives,
bounded and nonoverlapping ELF metadata, exact section and symbol sets, zero
relocations, zero undefined globals, and absence of allocated data or foreign
executable payload.

Hostile fixtures reject corrupted identity or machine fields, truncation,
resource-cap violations, instruction mutation, section growth, foreign data,
undefined globals, introduced relocations, and duplicate ownership. Private
authoritative comparison separately requires exact equality for all 13 bodies
and passes at 884 of 884 bytes.

This is function-code credit only. All DllBattle data and every unclaimed code
range remain unmatched, and the unit remains incomplete.

For integration, append `{ "path": "src/cro/DllBattle/record_ops_04.S",
"mode": "arm" }` and the 13 manifest function entries to the existing sorted
`DllBattle` entry in `config/cro-sources.json`. Preserve existing ownership and
do not mark the unit complete.
