# DllBattle record leaves 01

This batch reconstructs nine previously unclaimed ARM functions from the public
`cro/DllBattle` inventory for `AS_EUR_REV2`. It owns 272 executable bytes and
68 instructions. The source contains only independently written code: no CRO
payload, literal pool, string, asset, target object, or adjacent bytes are
included.

| Function | Address | Bytes | Instructions | Contract |
| --- | ---: | ---: | ---: | --- |
| `func_0001E140` | `0x0001E140` | 40 | 10 | append one byte while a ten-entry count has capacity |
| `func_0003F34C` | `0x0003F34C` | 28 | 7 | copy three word fields into a nested record |
| `func_0005C2D8` | `0x0005C2D8` | 24 | 6 | replicate one byte across eight bytes |
| `func_00075BFC` | `0x00075BFC` | 24 | 6 | replicate one byte across six bytes |
| `func_0007C1D8` | `0x0007C1D8` | 36 | 9 | zero a 25-byte record with word stores and a byte tail |
| `func_000CEDEC` | `0x000CEDEC` | 40 | 10 | zero a 26-byte record while preserving the observed store order |
| `func_000D3268` | `0x000D3268` | 28 | 7 | copy a seven-byte word/halfword/byte record |
| `func_000D3284` | `0x000D3284` | 28 | 7 | replicate one byte across ten bytes |
| `func_000D32A0` | `0x000D32A0` | 24 | 6 | replicate one byte across five bytes |

Every body is four-byte aligned, call-free, literal-free, and relocation-free.
Each occupies exactly one `.text.<function>` section with one global function
symbol and one ARM mapping symbol. The batch exports no other global identity
and allocates no data section.

The pinned manifest records the neutral public boundaries, source hash,
instruction totals, semantics, body hashes derived from the authored source,
and resource limits. The validator independently checks:

- exact CSV identity, mode, address, and size for all nine public boundaries;
- source pinning and absence of `.incbin`, encoded instructions, data, strings,
  duplicate declarations, or ownership overlap;
- bounded, nonoverlapping ELF32 ARM metadata and canonical section/symbol
  ownership;
- the exact nine-section executable set, 272-byte aggregate, zero relocations,
  zero undefined globals, and no allocated data or foreign executable payload;
- exact byte equality for each authored section when the private authoritative
  split target is supplied; and
- hostile mutations covering the ELF identity, machine, truncation, resource
  caps, instruction bytes, section growth, foreign allocated data, undefined
  globals, relocation sections, and duplicate ownership.

The authoritative comparison is nine of nine functions and 272 of 272 bytes.
This is function-code credit only. All other DllBattle code and every data
section remain unmatched, so `cro/DllBattle` remains incomplete.

For integration, append the source `{ "path":
"src/cro/DllBattle/record_leaves_01.S", "mode": "arm" }` and the nine manifest
function entries to the existing sorted `DllBattle` entry in
`config/cro-sources.json`. Do not replace that entry or mark the unit complete.
