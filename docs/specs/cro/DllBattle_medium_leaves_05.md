# DllBattle medium leaves 05

This batch reconstructs four medium-sized, call-free ARM functions from the
public `cro/DllBattle` inventory for `AS_EUR_REV2`. It owns 488 executable bytes
and 122 instructions. No target payload, literal pool, string, asset, allocated
data, relocation, or adjacent range is included.

| Function | Address | Bytes | Contract |
| --- | ---: | ---: | --- |
| `func_000596B4` | `0x000596B4` | 160 | calculate a normalized vector delta from record fields |
| `func_00071AF8` | `0x00071AF8` | 104 | search five paired records for a byte key |
| `func_00075D50` | `0x00075D50` | 124 | bounded membership search over halfword pairs |
| `func_0007C854` | `0x0007C854` | 100 | update a bounded packed field for two accepted kinds |

Each body is four-byte aligned and isolated in one `.text.<function>` section
with one ARM mapping symbol and one global function symbol. The source exports
no other identity and has no allocated non-code section.

The pinned manifest records exact neutral boundaries, source and authored-body
hashes, semantic labels, aggregate counts, and resource limits. Its validator
uses the shared strict DllBattle ELF gate to enforce the public inventory,
disjoint ownership, forbidden source directives, bounded ELF parsing, exact
section and symbol sets, zero relocations and undefined globals, and rejection
of allocated data or foreign executable payload.

Hostile fixtures cover malformed identity and machine metadata, truncation,
resource caps, instruction mutation, section growth, foreign data, undefined
globals, relocation introduction, and duplicate ownership. Private target
comparison passes all four functions at exactly 488 of 488 bytes.

This is code-only credit. DllBattle remains incomplete; all data and unclaimed
code remain unmatched.

For integration, append `{ "path": "src/cro/DllBattle/medium_leaves_05.S",
"mode": "arm" }` and the four manifest function entries to the existing sorted
`DllBattle` entry in `config/cro-sources.json`. Preserve prior ownership and do
not mark the unit complete.
