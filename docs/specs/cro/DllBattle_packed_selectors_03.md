# DllBattle packed selectors 03

This batch reconstructs 13 public ARM functions in `cro/DllBattle` for
`AS_EUR_REV2`, totaling 820 executable bytes and 205 instructions. The source
is independently written and contains no literal pool, target payload, string,
asset, data section, or adjacent bytes.

| Function | Address | Bytes | Contract |
| --- | ---: | ---: | --- |
| `func_00050908` | `0x00050908` | 88 | validate four pairs of signed slots |
| `func_000509EC` | `0x000509EC` | 84 | map a nonzero halfword to one of four slots |
| `func_00051A64` | `0x00051A64` | 56 | insert a value while packed capacity remains |
| `func_00051B38` | `0x00051B38` | 80 | search a linked record chain by two byte keys and a flag |
| `func_0006731C` | `0x0006731C` | 68 | toggle a paired state when a nested field is present |
| `func_0007347C` | `0x0007347C` | 80 | return the first active slot among five packed words |
| `func_00076264` | `0x00076264` | 64 | search five pairs of bytes for a bounded value |
| `func_000772E8` | `0x000772E8` | 56 | extract a value according to a packed kind |
| `func_00079628` | `0x00079628` | 40 | configure packed fields and one boolean bit |
| `func_00079FC8` | `0x00079FC8` | 56 | append a word while packed capacity remains |
| `func_0007C788` | `0x0007C788` | 36 | store a word and advance a packed count when bounded |
| `func_0007C808` | `0x0007C808` | 76 | update a kind-specific packed boolean field |
| `func_0007FE38` | `0x0007FE38` | 36 | recognize one packed kind/value pair |

Every body is four-byte aligned, call-free, relocation-free, and isolated in
one `.text.<function>` section. The batch has exactly 13 global function
symbols, no other global identity, and no allocated non-code payload.

The pinned manifest records the neutral inventory boundaries, source hash,
body hashes derived from the authored assembly, semantic labels, aggregate
counts, and parser resource limits. Its batch validator selects the shared
strict DllBattle ELF gate, which checks exact CSV identities, unique and
nonoverlapping ownership, forbidden source directives, bounded ELF structure,
exact section/mapping/function symbols, absence of relocations and undefined
globals, and rejection of data or foreign executable payload.

Hostile fixtures cover bad ELF identity, wrong machine, truncation, file and
section-count caps, instruction mutation, section growth, foreign allocated
data, undefined globals, introduced relocations, and duplicate ownership. The
private authoritative comparison additionally requires byte equality for each
section and passes at 13 of 13 functions and 820 of 820 bytes.

Only reviewed function code is claimed. DllBattle data and every other code
range remain unmatched, and the unit remains incomplete.

For integration, append `{ "path":
"src/cro/DllBattle/packed_selectors_03.S", "mode": "arm" }` and the 13 manifest
function entries to the existing sorted `DllBattle` entry in
`config/cro-sources.json`. Preserve all other sources and claims and do not
mark the unit complete.
