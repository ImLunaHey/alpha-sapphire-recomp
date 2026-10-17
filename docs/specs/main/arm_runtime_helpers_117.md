# ARM runtime/helper batch 117 specification

## Scope and evidence

This batch covers six unique, currently unmatched ARM functions with entries in
`[0x00400000, 0x00440000)`. Selection used the ignored AS_EUR_REV2 report,
neutral symbol inventory, recursive public ownership manifests, and bounded
control-flow inspection of the privately held executable. The implementation
owns 400 executable body bytes (100 ARM instructions) and no adjacent bytes.
No ROM, extracted asset, string, table, literal value, target hash, or target
byte sequence is part of this handoff.

All six bodies are complete leaves. They contain 21 memory operations, 16 local
branches, one conditional direct call, five direct tails, six return sites, no
indirect transfer, and six `R_ARM_JUMP24` relocations. Every external destination
is an established global function entry; no branch reaches an interior or
secondary entry.

## Ownership boundaries

| Function | Body/owned | Next global | Next offset |
| --- | ---: | --- | ---: |
| `func_004151E0` | 128 | `func_00415260` | 128 |
| `func_0041E490` | 52 | `func_0041E4C4` | 52 |
| `func_0041E4C4` | 60 | `func_0041E534` | 112 |
| `func_0041EDB4` | 52 | `func_0041EDE8` | 52 |
| `func_0041EDE8` | 60 | `func_0041EE24` | 60 |
| `func_00425F04` | 48 | `func_004260C4` | 448 |

The body and owned sizes are identical. Gaps after `func_0041E4C4` and
`func_00425F04` are excluded. A complete audit of public source labels, C
definitions, aliases, and configuration intervals found no prior owner or
overlap. The current report marks every selected entry unmatched.

## Exact schedules

Preserve instruction order, register assignment, condition codes, flag effects,
immediates, memory widths, and transfer type exactly as written in the source.
Every instruction is four bytes.

### `func_004151E0`

Save `r4/lr`, retain the input in `r4`, and classify three bounded subranges
when its sign bit is set. The fallback passes the original value, current PC,
and sign bit to `func_00124FB0` with a conditional call. Both paths return the
original value in `r0`.

Local transfers are `(12→120, 36→56, 44→56, 52→120, 60→80, 68→80,
76→120, 84→104, 92→104, 100→120)`. Offset 116 is `blne func_00124FB0`
with `R_ARM_JUMP24`; offset 124 returns through `pop {r4, pc}`.

### `func_0041E490` and `func_0041EDB4`

Both load the word at offset four. A null word takes the explicit zero-return
path (`mov r2,#0; mov r1,r2; mov r0,r2; mov r0,r0; mov r0,#0`) and returns
through `pop {r4,pc}`. A non-null word restores `r4/lr`, loads the selector, and
tail-branches to `func_0036DF28`. The selectors are respectively 92 and 91.
Each local null branch is at offset 12 to 28; each tail relocation is at offset
24.

### `func_0041E4C4` and `func_0041EDE8`

These retain the same null-return schedule. On the non-null path they also zero
`r3`, restore `r4/lr`, copy `r3` to `r2`, load a selector, and tail-branch to
`func_0036DF4C`. The selectors are respectively 92 and 91. Each local null
branch is at offset 12 to 36; each tail relocation is at offset 32.

### `func_00425F04`

Read the byte at offset five. If set, load the word at offset 40 and require it
to be non-null; then require the byte at offset 16 to equal one. Failure returns
zero through `bx lr`. Success loads four in `r1` and tail-branches to
`func_00160BA8`. Local branches are `16→32` and `28→40`; the tail relocation
is at offset 44.

## ELF and relocation contract

Require ELF32 little-endian ARM `ET_REL`, EABI5 flags exactly `0x05000000`, and
the pinned ARMv6K/ARM/Thumb-1/VFPv2 attributes. Each owned function has exactly
one uniquely named `ALLOC|EXECINSTR` `PROGBITS` section, address zero, alignment
four, exact body size, canonical `$a` mapping at zero, and one global,
default-visible `STT_FUNC` of exact size. No `$d` mapping or adjacent data is
allowed.

Each section has exactly one `REL` section with `INFO_LINK`, alignment four,
entry size eight, and its specified `R_ARM_JUMP24` record. The external symbols
are undefined global `STT_NOTYPE` symbols with zero value/size and default
visibility. Reject `RELA`, `DYNSYM`, duplicate owned sections, extra relocations,
aliases, changed instructions or relocation addends, foreign nonempty executable
payload, and malformed symbol, mapping, section, or ELF metadata. Unrelated
empty executable sections are accepted.

Cap the complete input at 64 MiB, aggregate executable bytes at 16 MiB, sections
at 16,384, symbols at 1,000,000, and relocation records at 1,000,000 before
expensive parsing. Source, raw and normalized config, and this specification are
hash-pinned. The self-test assembles the public source, accepts a composite with
12,000 unrelated empty executable sections, and rejects instruction, relocation,
symbol, mapping, section, attribute, header, truncation, and parser-cap mutations.

## Authoritative validation

The optional private audit accepts only the ignored extracted `code.bin`. It
checks exact body bytes after resolving each branch relocation to its configured
global target, validates neutral inventory boundaries and ARM mapping state, and
repeats the overlap/current-unmatched audit. Private evidence remains outside Git.

```sh
node scripts/validate-arm-runtime-helpers-117.mjs --self-test
node scripts/validate-arm-runtime-helpers-117.mjs <lane-object>
node scripts/validate-arm-runtime-helpers-117.mjs --audit-private "$DECOMP_PRIVATE/code.bin"
git diff --check
```

No shared build, source integration, progress, or objdiff files are lane-owned.
