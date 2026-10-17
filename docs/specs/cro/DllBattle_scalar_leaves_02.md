# DllBattle scalar leaves 02

This batch reconstructs 19 previously unclaimed ARM functions from the public
`cro/DllBattle` inventory for `AS_EUR_REV2`. It owns 732 executable bytes and
183 instructions. All implementations are independently written, literal-free
code; the batch contains no CRO payload, string, asset, data section, target
object, or adjacent bytes.

| Function | Address | Bytes | Contract |
| --- | ---: | ---: | --- |
| `func_0004FE04` | `0x0004FE04` | 28 | extract a packed field for one accepted kind |
| `func_0004FE20` | `0x0004FE20` | 24 | compose a bounded packed index |
| `func_000507C8` | `0x000507C8` | 32 | test and set one state flag |
| `func_00050D70` | `0x00050D70` | 56 | compare two values by category, excluding a sentinel |
| `func_00050FE0` | `0x00050FE0` | 44 | test one indexed bit in the first state set |
| `func_00051214` | `0x00051214` | 44 | test one indexed bit in the second state set |
| `func_00051A9C` | `0x00051A9C` | 32 | replace selected packed header fields |
| `func_0005CC28` | `0x0005CC28` | 64 | bounded occurrence search across ten bytes |
| `func_00064808` | `0x00064808` | 36 | select a primary or flagged alternate pointer |
| `func_000763A8` | `0x000763A8` | 32 | compose and store two packed fields |
| `func_0007F344` | `0x0007F344` | 28 | compose two packed fields and a fixed kind |
| `func_000A6AFC` | `0x000A6AFC` | 32 | map an input into four scalar classes |
| `func_000A6B68` | `0x000A6B68` | 36 | fixed-point scale and clamp zero upward |
| `func_000A6C78` | `0x000A6C78` | 28 | fixed-point scale with observed rounding |
| `func_000D080C` | `0x000D080C` | 28 | test whether an indexed pointer is null |
| `func_000D0C40` | `0x000D0C40` | 32 | return an indexed fallback only for a null pointer |
| `func_000D1800` | `0x000D1800` | 48 | recognize one packed kind/value pair |
| `func_000D1838` | `0x000D1838` | 56 | test membership in four halfword fields |
| `func_000D2E30` | `0x000D2E30` | 52 | bounded nested byte selection with sentinel fallback |

Every function is four-byte aligned, call-free, relocation-free, and contained
in exactly one `.text.<function>` section. Together the sections export exactly
19 global functions and no other global identities.

The pinned manifest records the neutral public boundaries, source hash,
instruction totals, semantic labels, authored body hashes, and parser resource
limits. The batch validator selects the shared DllBattle strict ELF gate and
checks exact inventory identity, disjoint ownership, source pinning, forbidden
opaque/data directives, bounded nonoverlapping ELF metadata, exact section and
symbol ownership, zero relocations, zero undefined globals, and absence of
allocated data or foreign executable payload.

Its hostile fixtures reject bad ELF identity, a wrong machine, truncation,
oversize input, excessive section counts, instruction mutation, section growth,
foreign allocated data, undefined globals, an introduced relocation section,
and duplicate ownership. With the private authoritative split target supplied,
the validator requires byte equality independently for all 19 sections. The
result is 19 of 19 functions and 732 of 732 bytes.

This batch claims function code only. It does not claim data, pools, gaps, or
the rest of DllBattle, and the unit remains incomplete.

For integration, append `{ "path":
"src/cro/DllBattle/scalar_leaves_02.S", "mode": "arm" }` and the 19 function
entries from the batch manifest to the existing sorted `DllBattle` entry in
`config/cro-sources.json`. Retain every earlier source and function and do not
mark the unit complete.
