# DllUSGymFire link layout — AS_EUR_REV2

## Status, scope, and provenance

This is an **ANALYSIS specification**, limited to `cro/DllUSGymFire`, observed
on 2026-10-17 at repository commit
`4a07fbcd399281cd0006d8cf3c439e6bc50ec2bb`. It records layout and neutral
interface facts under [the clean-room protocol](../../CLEAN_ROOM.md). It does
not implement a module, establish original translation-unit boundaries, or
approve publication of proprietary payloads. No source, configuration,
partition, validator, or generated comparison artifact was changed.

All references to the current policy, accepted inventory, and splitter below
mean the pinned commit above. Concurrent workspace edits appeared during the
analysis and were left untouched; final inventory/semantic checks and artifact
hash checks explicitly used the pinned CSV and JSON read from Git, excluding
those later edits.

Private verification inputs were located exclusively through the root
checkout's ignored `.env.local`. Only this module's extracted CRO and existing
objects were inspected. The extracted CRO's complete size and SHA-256 agree
with its entry in `progress/units/AS_EUR_REV2.cro.json`; the whole ROM was not
rehashed or re-extracted in this analysis. No private location or setting value
is recorded here.

Evidence and tools:

- Node.js **v24.21.0**, repository `parseCro` / `buildCroTargetElf` from
  `scripts/generate-cro-target-object.mjs`, and `parseFunctionInventory` /
  `splitCroTargetElf` from `scripts/split-cro-target-object.mjs` at the commit
  above. Conversion and splitting were regenerated **in memory**.
- An independent read-only ELF field walk checked section headers, symbols,
  REL records, file gaps, hashes, and partition coverage. Existing structural,
  split-target, skeleton, and authored-base objects were compared without
  overwriting them.
- GNU ARM objdump **2.44** was used privately for instruction/reference
  observations. No disassembly or instruction encodings are reproduced.
  Byte predicates independently confirmed return and veneer forms; successful
  decoding alone was not treated as proof of code or function boundaries.
- `validateCroInventory` and `validateCroFunctionSemantics`, using that
  objdump, both passed for this module: one independently evidenced ARM
  function, 224 body bytes, 64 pools, 93 text relocations.
- Public corroboration: `symbols/cro/DllUSGymFire.csv`,
  `symbols/cro-partitions/DllUSGymFire.json`,
  [contract 10](contract_10.md),
  [CRO target-object documentation](../../CRO_TARGET_OBJECTS.md), and the
  selected unit in `progress/reports/AS_EUR_REV2/report.json`.

No external platform or SDK document was used. C++ descriptor/dispatch-table
interpretations below are explicitly structural inferences from this module,
not copied SDK definitions. Opaque payloads are described by extent, schema,
count, and hash instead of reproducing strings, table entries, or bytes.
All hashes are SHA-256 over exactly the stated byte interval; string hashes
include the terminating NUL unless explicitly stated otherwise. Intervals are
half-open. CRO offsets are file offsets; text/rodata offsets are relative to
their respective segments; ELF offsets are file offsets. All numbers in size
columns are decimal unless prefixed with `0x`.

## Artifact identities and an observed reproducibility discrepancy

| Artifact | File size | SHA-256 |
| --- | ---: | --- |
| Verified CRO | 16,384 | `583f1587e0a16a61ac49ba0e78e9cbc013202730ea0b14aa6dd23216bb3f26b8` |
| Structural target, regenerated and existing | 12,164 | `e79ddaafb1b6c723fdbddc5ca0c27f44c99613a3185bd7291cb9bceece0a9324` |
| Split target, regenerated at this commit | 31,428 | `465ebb7b43650faa356e6f1bdbb6f043aac4db841aaa2c7d4e9a412000cd5fb6` |
| Existing cached split target | 29,860 | `d27f7f9eca3e65c9889a27cf41fdb62c29ee35a223902aa177324fd666c5eed0` |
| Empty split skeleton, regenerated and existing | 19,172 | `2e0d396493983e1de5433bf315f23f0f7c53c66ddfd2baa9395fb4622fee4cad` |
| Existing authored comparison base | 628 | `460416b5281a0bbfaebc0bae2a04c914805e658302b31a049e6b7b5f9d28d138` |

The cached target is **not** the byte-identical output of the current splitter.
It has the same 201 section names, identical PROGBITS payloads by section name,
and the same 123 semantic relocation tuples (output section/name, offset,
type, target identity, addend). Its section headers interleave relocation
sections with their owners, its relocation payloads follow its symbol strings,
and its section-name table is compacted. The regenerated target groups all
relocation sections after content sections and writes full section-name
strings. The 1,568-byte file-size difference equals the section-name-table
size difference, 5,220 minus 3,652. Section indices, symbol section indices,
relocation header links, and file offsets also differ. The transformation
history of the cache was not established; neither representation was silently
substituted for the other.

The CSV hash is
`ef2ec99f5b8908a5f4f4376110fe4d09e8adc23c194372d8e59bf3656976bc02`;
the partition JSON hash is
`760d8a39f21a8aa5d3bd63258266f1d5c98afa1e57b475d1e27acefe5c287215`.

## Complete CRO container accounting

The declared file size is `0x4000`. The header is `0x138` bytes, including
four 32-byte coverage digests. The verified coverage intervals are
`[0x0080,0x0180)`, `[0x0180,0x3000)`, `[0x3000,0x383C)`, and
`[0x383C,0x3840)`. Their hashes, in that order, are:

- `196df7272f5155b699866669c240353fbf42790d4baa7f4128f0aded1a31e686`
- `558204c5d17cc0728ba8948a32d56ee3df91c46bf855793e386d678bcad38088`
- `0932e4b602a4d49b4738bb3224d475716666581872f39fa2306cd9b7dab6320e`
- `df3f619804a92fdb4057192dc43dd748ea778adc52bc498ce80524c014b81119`

The table descriptors occupy the repository parser's 17 header slots starting
at `0xB0`, each holding an offset and byte count or element count. Physical
metadata order differs from descriptor order.

| CRO interval | Bytes | Ownership / schema |
| --- | ---: | --- |
| `[0x0000,0x0138)` | 312 | Digests and structured CRO header |
| `[0x0138,0x0180)` | 72 | Verified zero fill before code blob |
| `[0x0180,0x1A98)` | 6,424 | Segment 0, text |
| `[0x1A98,0x2000)` | 1,384 | Verified zero fill inside code hash region |
| `[0x2000,0x2240)` | 576 | Segment 1, rodata |
| `[0x2240,0x3000)` | 3,520 | Verified zero fill inside code hash region |
| `[0x3000,0x300D)` | 13 | Public module identity plus NUL |
| `[0x300D,0x3010)` | 3 | Verified zero alignment fill |
| `[0x3010,0x3058)` | 72 | Six segment records, 12 bytes each |
| `[0x3058,0x3060)` | 8 | One named-export record |
| `[0x3060,0x3070)` | 16 | Two export-tree records, 8 bytes each |
| `[0x3070,0x3083)` | 19 | Export-name string table |
| `[0x3083,0x3084)` | 1 | Verified zero alignment fill |
| `[0x3084,0x30AC)` | 40 | Two import-module records, 20 bytes each |
| `[0x30AC,0x334C)` | 672 | 56 import-patch records, 12 bytes each |
| `[0x334C,0x3504)` | 440 | 55 anonymous-import records, 8 bytes each |
| `[0x3504,0x3516)` | 18 | Two dependency identities, each 8 bytes plus NUL |
| `[0x3516,0x3518)` | 2 | Verified zero alignment fill |
| `[0x3518,0x383C)` | 804 | 67 internal-relocation records, 12 bytes each |
| `[0x383C,0x3840)` | 4 | Segment 2, initialized data; zero-valued word |
| `[0x3840,0x4000)` | 1,984 | Uniform **nonzero** trailing fill, outside all four digest coverage regions |

The indexed-export table is empty at `0x3070`. Named-import and indexed-import
tables are empty at `0x334C`. Both auxiliary relocation tables, called
`unknown14` and `unknown16` by the parser, are empty at `0x3518`; their names
do not imply additional unaccounted payload in this module.

Record schemas established by the repository parser are: segment records
`{fileOffset:u32, size:u32, type:u32}`; named exports
`{nameStringOffset:u32, encodedTarget:u32}`; anonymous imports
`{encodedForeignTarget:u32, patchListHeadFileOffset:u32}`; and import-module
records `{nameStringOffset:u32, indexedSubtableOffset:u32,
indexedCount:u32, anonymousSubtableOffset:u32, anonymousCount:u32}`.
An encoded target uses its low four bits for segment index and remaining
28 bits for segment-relative offset. Relocation records contain encoded
output, an eight-bit type, an eight-bit list terminator (external) or target
segment (internal), two reserved zero bytes, and a 32-bit addend. Counts,
subtable bounds, and patch ownership were validated, not inferred from
filenames or dependency names.

Two fixed header intervals are retained but **not semantically decoded** by
this analysis or the converter: `[0x84,0x90)` (three words, two zero), hash
`e7c9d548a36cf49dccfc6279840664d3aa94c1ae74a4f6f169a84717a8ef13c6`,
and `[0x98,0xB0)` (six words, two zero), hash
`6a8561c49ab21e5de62cf0b0a65a74ebd12476d164e1a85a8e34f5250a7a2834`.
They are additional semantic unknowns for complete CRO emission, not holes
in file accounting. The 16-byte export-tree payload is also not decoded
beyond its two-record extent; its hash is
`b5b07ca7bf9c57e995ff0a04d82aa82f052dd9bd6e921130d430765b92039694`.
No loader-entry or tree-field meaning is assigned without further evidence.

Segment records 0–3 describe text, rodata, data, and a 16-byte BSS segment;
BSS has no file payload. Records 4 and 5 are empty reserved records. The header
requests **48 bytes** of BSS allocation, **32 more** than the segment's 16
bytes. The converter preserves the segment extent, not the extra allocation.
The purpose and subdivision of those additional 32 runtime bytes are not
proven here and must not be invented as another authored global.

The code blob is 11,904 bytes: 6,424 text + 576 rodata + 4,904 zero fill.
The metadata region is 2,108 bytes. Thus complete file coverage is
`312 + 72 + 11,904 + 2,108 + 4 + 1,984 = 16,384`.
Container padding and metadata excluded by conversion are not ELF sections.
In particular, CRO byte identity requires preserving the trailing fill;
segment identity alone cannot verify it. Its hash is
`475dab51a266a4ba7bb16f84b1790b82aa6dd1b29e253d620b0b71c7ca9f80de`.

## Structural ELF: every section

The generated object is ELF32 little-endian ARM `ET_REL`, EABI5, with a
52-byte ELF header, zero entry/address fields, no program headers, and
40-byte section headers. Alignment 4 is an explicit converter choice for
segment sections; it does not recover an original compiler's stronger
alignment requirements. Text starts at CRO offset `0x180`; rodata at `0x2000`.

| Index | Section | Type / flags | ELF offset | Size | Alignment |
| ---: | --- | --- | ---: | ---: | ---: |
| 0 | Null | NULL / none | `0x0000` | 0 | 0 |
| 1 | `.text` | PROGBITS / AX | `0x0034` | 6,424 | 4 |
| 2 | `.rodata` | PROGBITS / A | `0x194C` | 576 | 4 |
| 3 | `.data` | PROGBITS / WA | `0x1B8C` | 4 | 4 |
| 4 | `.bss` | NOBITS / WA | `0x1B90` | 16 | 4 |
| 5 | `.cro.module` | PROGBITS / none | `0x1B90` | 13 | 1 |
| 6 | `.rel.text` | REL / INFO_LINK | `0x1BA0` | 744 | 4 |
| 7 | `.rel.rodata` | REL / INFO_LINK | `0x1E88` | 240 | 4 |
| 8 | `.symtab` | SYMTAB / none | `0x1F78` | 976 | 4 |
| 9 | `.strtab` | STRTAB / none | `0x2348` | 2,605 | 1 |
| 10 | `.shstrtab` | STRTAB / none | `0x2D75` | 86 | 1 |

The section-header table is `[0x2DCC,0x2F84)`, 440 bytes. File alignment
fill is zero at `[0x1B9D,0x1BA0)` and `[0x2DCB,0x2DCC)`, totaling four bytes.
No bytes are allocated for NOBITS BSS despite its shared file offset with
the marker. `.cro.module` contains only the already-public unit identity and
NUL; it is nonallocating comparison metadata.

`.symtab` has 61 entries of 16 bytes: null, four local section symbols,
one global text export of size zero, and 55 global undefined NOTYPE imports.
Its first-global index is 5 and its string-table link is 9. Both REL tables
link to symbol table 8, have entry size 8, and identify output sections 1 and
2 respectively. There is no `.rel.data`, BSS relocation, RELA, debug, unwind,
or ARM-attributes section in this structural artifact.

Conversion places each REL addend into the formerly unresolved word, so raw
CRO segment hashes and structural section hashes intentionally differ:

| Region | Raw CRO segment hash | Structural section hash |
| --- | --- | --- |
| Text | `ff6f25a54b56d24e747b7f723e8459ffd927ae666ca390bd217d4fd554b41f24` | `6307bbfa0ee920a9cba4f6d22e63bce3fd0b1d9c2775dc59980f0d87f3303c94` |
| Rodata | `3443cbcfc522fcc23f0087e123a1a014cdca032828f57f87e9425842af640d74` | `9fa3bb010389e13a49d11830836d13eda3400ab4933f292bd1b9d67bba516c52` |

Raw initialized data is unchanged. A correct reverse-conversion check clears
the 123 relocation output words and separately preserves their addends and
identities; directly comparing normalized payloads to CRO segments is wrong.

## Complete text partition and split-section rules

The public partition contains 132 nonempty ranges covering `[0,0x1918)`
exactly: one accepted function / 224 bytes, 64 ARM gaps / 5,668 bytes,
64 pools / 460 bytes, and three unknown ranges / 72 bytes. No Thumb range is
declared. All observed boundaries are four-byte aligned, but the splitter
assigns pool and unknown sections alignment **1**.

For a range starting at address `a`, let `h` be its eight-digit lowercase
hexadecimal spelling. The deterministic section/symbol schema is:

- Function: `.text.func_00000DCC`, global FUNC `func_00000DCC`, value 0,
  size 224, alignment 4, flags AX, local `$a` mapping symbol.
- Gap: `.text.__cro_gap_h`, alignment 4, flags AX, local section and `$a`
  symbols, **no global function**. A gap may contain several bodies or tails.
- Pool: `.pool.__cro_pool_h`, alignment 1, flags A, global OBJECT
  `__cro_pool_h` with the exact extent, and local section / `$d` symbols.
- Unknown: `.cro.unknown.h`, alignment 1, flags zero, local section symbol,
  no mapping or global code/data symbol.

In the regenerated target, range sections are indexed 1–132 by increasing
text address, and every range payload begins at ELF file offset `0x34 + a`.
There is no extra fill between these ranges. Their type is PROGBITS. The
empty skeleton uses NOBITS with the same logical sizes and identities.

### Repeated prefix

For each integer `i` in `[0,52)`, `[8i,8i+4)` is an ARM gap and
`[8i+4,8i+8)` is a four-byte pool. Their regenerated section indices are
`2i+1` and `2i+2`. Independently observed form: an indirect import veneer
loading the program counter from the following word. Each pool has one
ABS32 relocation to a distinct anonymous code import with zero addend.
This accounts for `[0,0x1A0)`, 52 veneers / 208 executable bytes and
52 pools / 208 data bytes. These are not accepted functions in the CSV.

### All subsequent code-classified ranges

| Regenerated section index | Text interval | Bytes | Classification |
| ---: | --- | ---: | --- |
| 105 | `[0x01A0,0x01B4)` | 20 | ARM gap |
| 107 | `[0x01CC,0x0204)` | 56 | ARM gap |
| 109 | `[0x022C,0x0608)` | 988 | ARM gap |
| 111 | `[0x0614,0x0704)` | 240 | ARM gap |
| 113 | `[0x072C,0x0BB8)` | 1,164 | ARM gap |
| 115 | `[0x0BD4,0x0DC8)` | 500 | ARM gap |
| 117 | `[0x0DCC,0x0EAC)` | 224 | Accepted `func_00000DCC` |
| 120 | `[0x0EC0,0x0EE8)` | 40 | ARM gap |
| 122 | `[0x0EEC,0x16A8)` | 1,980 | ARM gap |
| 124 | `[0x16CC,0x1828)` | 348 | ARM gap |
| 126 | `[0x1834,0x183C)` | 8 | ARM gap |
| 129 | `[0x1868,0x187C)` | 20 | ARM gap / exported entry |
| 131 | `[0x1890,0x18F0)` | 96 | ARM gap |

The accepted function has 56 ARM instruction words, no relocation output,
and hash `984d6534477ff789271a7776b6a1d10c2d537b7c1f858b1cffa92565fe04e99a`,
matching the published contract-10 identity. Its ownership excludes every
neighboring pool, unknown range, and padding byte. Completing the one accepted
body does not complete the other 5,668 code-classified bytes.

### All subsequent pools

Every word in these pools is either an ABS32 slot or a retained scalar word;
the last column counts those classes without publishing bulk contents.

| Index | Text interval | Bytes | Relocated words | Symbolic contents |
| ---: | --- | ---: | ---: | --- |
| 108 | `[0x0204,0x022C)` | 40 | 10 | Internal code-target table, 10 entries |
| 110 | `[0x0608,0x0614)` | 12 | 0 | Three scalar words |
| 112 | `[0x0704,0x072C)` | 40 | 10 | Internal code-target table, 10 entries |
| 114 | `[0x0BB8,0x0BD4)` | 28 | 0 | Seven scalar words |
| 116 | `[0x0DC8,0x0DCC)` | 4 | 0 | One scalar word |
| 119 | `[0x0EB4,0x0EC0)` | 12 | 0 | Three scalar words |
| 121 | `[0x0EE8,0x0EEC)` | 4 | 1 | Pointer to rodata `0x1E8` |
| 123 | `[0x16A8,0x16CC)` | 36 | 5 | Five rodata pointers; four scalars |
| 125 | `[0x1828,0x1834)` | 12 | 3 | Two rodata pointers and one text pointer |
| 128 | `[0x1864,0x1868)` | 4 | 1 | Pointer to BSS start |
| 130 | `[0x187C,0x1890)` | 20 | 5 | Internal code-target table, five entries |
| 132 | `[0x18F0,0x1918)` | 40 | 6 | One data pointer, three text pointers, two rodata pointers; four scalars |

These 12 pools contribute 252 bytes. Together with prefix pools they contain
115 words: 93 relocation slots / 372 bytes and 22 scalar words / 88 bytes.
There are five scalar zeros among those 22 words. Several scalar words are
consumed as floating-point constants; treating every nonpointer as an integer
or as padding is unsupported. Actual values remain unprovided here.

The five rodata pointer addends in pool `0x16A8` are `0`, `2`, `5`, `1`, and
`0x40`; low bits here are **byte offsets**, not Thumb flags. Pool `0x1828`
references rodata `0x208`, text `0x1A0`, and rodata `8`. The last pool includes
an initializer-pointer entry at text `0x1914` targeting `0x183C`, with bounds
pointing to `0x1914` and one-past-text `0x1918`. Its two rodata pointers both
target one-past-rodata `0x240`, consistent with an empty bounded array.
These one-past values are valid linker arithmetic, not missing sections.

### Every current unknown range

| Index | Text interval | Bytes | SHA-256 |
| ---: | --- | ---: | --- |
| 106 | `[0x01B4,0x01CC)` | 24 | `c0d4a8a4064dec0f151354f0853d34b6dbcc9d7752d58f5e8e8521cdc07e0854` |
| 118 | `[0x0EAC,0x0EB4)` | 8 | `5ca6456661e191c7a74f1d68bb95578d7b98ecd067e4692615e0e374301e3522` |
| 127 | `[0x183C,0x1864)` | 40 | `99529fb2a2e35f6b4c0e45ad2451c20c3ed2ec9a511a4f48632387378ff88d59` |

`0x01B4`: six words have a coherent ARM interpretation, ending in a confirmed
register return at `0x01C8`. Observable memory operations include a word store
at object offset 24 and a word load at another object's offset 416. No direct
branch, internal relocation, or recognized direct PC-relative literal load
from elsewhere was found targeting this interval. An entry/body assignment
therefore remains unproven; the 24 bytes are not padding or a newly accepted
function merely because they decode.

`0x0EAC`: two nonzero words immediately follow the accepted function. Both
admit finite binary32 interpretations. No relocation output, direct branch
target, internal pointer target, or recognized direct PC-relative load target
was found in this interval. Their scalar role versus other data remains
unresolved; no constant values or invented function are supplied.

`0x183C`: stronger evidence supports a **candidate mixed range**:
`[0x183C,0x185C)` is eight ARM words ending in a confirmed return at `0x1858`;
`[0x185C,0x1864)` supplies two nearby floating-point load operands. The
candidate routine loads the relocated BSS pointer from `0x1864` and performs
four binary32 stores at object offsets 0, 4, 8, and 12. The internal pointer
at `0x1914` targets `0x183C`. This is evidence for a 32-byte initialization
routine plus an eight-byte constant pool, **not an update to the accepted
partition**. Its current nonallocating unknown section and unmatched status
remain authoritative. Publishing that candidate would require a separately
reviewed boundary/mode/flow classification and matching gate behavior.

No relocation output lies in any unknown range. The initializer reference is
an **incoming target**, which is permitted by the splitter and does not itself
change the range's classification.

## Rodata, writable data, and BSS schemas

Rodata is exactly 576 bytes. The following structural views cover every byte;
only the observed access width is asserted where grouping is uncertain.

| Rodata interval | Bytes | Neutral schema / evidence |
| --- | ---: | --- |
| `[0x0000,0x0040)` | 64 | Opaque selector byte vector; code has byte-indexed accesses through offsets 0, 1, 2, and 5. No proven source-level record subdivision. |
| `[0x0040,0x0160)` | 288 | 72 little-endian signed words; storage view of 24 three-word records. Code uses indexed word loads and a three-word stride calculation. Semantic field names and full values withheld. |
| `[0x0160,0x016C)` | 12 | Three pointer fields: imported descriptor-table pointer plus 8, name S1, imported base descriptor |
| `[0x016C,0x0174)` | 8 | Two pointer fields: imported descriptor-table pointer plus 8, name S2 |
| `[0x0174,0x0180)` | 12 | Three pointer fields: same imported descriptor-table identity as `0x160` plus 8, name S3, local descriptor at `0x16C` |
| `[0x0180,0x019B)` | 27 | S1, 26 name characters plus NUL |
| `[0x019B,0x01B9)` | 30 | S2, 29 name characters plus NUL |
| `[0x01B9,0x01DE)` | 37 | S3, 36 name characters plus NUL |
| `[0x01DE,0x01E0)` | 2 | Uniform nonzero inter-object alignment fill; not a string terminator |
| `[0x01E0,0x0200)` | 32 | Zero header word, descriptor pointer to `0x160`, six text pointers |
| `[0x0200,0x0240)` | 64 | Zero header word, descriptor pointer to `0x174`, fourteen text pointers |

The three name strings have nested type-name encoding syntax; the pointer
relationships and two dispatch-table headers support a C++ runtime type
descriptor / virtual-dispatch interpretation. These roles are inferences;
original type names, class identities, and SDK definitions are not supplied.
The 20 dispatch entries are text targets in unmatched ARM gaps, not 20
additional accepted functions or exports. Table address points are `0x1E8`
and `0x208`, and code stores/references those interior addresses.

The selector vector hash is
`f74e2499a4606339c32e0b5c8cc772f5e634c7b4f93de3b14ecf45350e374040`;
the 288-byte integer region hash is
`b955f72199de17674dd55ae4e711f20ece74023895ed968dd74c4e7230c32e5d`.
The latter has 20 distinct word values and six zero words. These are authored
module data candidates, not relocation slots or a license to replace the
region with zeros. Record field meanings and a derivation of all entries
remain unspecified.

S1/S2/S3 hashes including NUL are respectively:

- `3978da311135ef91ca9eab0f611d655dd05875e9a95bbd4c6f3a665806ed5925`
- `0efb23730d34e2a823b7b2f32de658022f6421956f8aa96aa7684cc8d4a1e108`
- `5f8c2eb7db797a597dc11732144252c883281c7350c606000992f720772040a6`

The two fill bytes have hash
`ca2fd00fa001190744c15c317643ab092e7048ce086a243e2be9437c898de1bb`.
Their value is not reproduced. Across all rodata there are 30 relocation
words and eight nonrelocated zero words: six in the integer region and the
two dispatch-table header words. Every other nonpointer byte is covered by
the selector/table/name/fill regions above.

Initialized `.data` contains one zero-valued four-byte word, has no relocation,
and is referenced by the text pool at `0x18F0`. Its specific runtime role is
unproven; initial zero does not make the section NOBITS. BSS contains 16 bytes
of zero initialization, is referenced through the pool at `0x1864`, and has
the candidate four-field initializer described above. The progress split
target deliberately materializes these 16 zeros as PROGBITS. The skeleton's
BSS is NOBITS of size zero to prevent automatic match credit. Neither choice
changes the CRO's runtime BSS segment size or resolves the extra 32-byte
header allocation.

## Imports, export, and all relocation classes

There is one named export at text offset **`0x1868`**, ARM entry, with no
known function size from the CRO. The name is 18 UTF-8 bytes; its hash
**excluding NUL** is
`29c0652e12f4a1e224165e49fcbdb192cebd9c071710c79c0d7e6af0492baffa`.
The 19-byte export-string table has hash
`f7fbd739dda96c6f3df3319d4c4a64e56b3b187b7e0e7db5c33c2d48b37f8bcc`.
The converter emits this export as size-zero FUNC; splitting removes its
authored name and represents the target using the containing gap's section
identity. There are no indexed exports. The two-record export tree is loader
metadata, not a function inventory; its interpretation beyond the retained
tree schema was not needed to establish the single exported entry.

All **55 imports are anonymous**, divided into two dependency records in
their CRO order. Neutral dependency M0 owns 47 imports: 44 targeting foreign
segment 0 and three targeting foreign segment 1. M1 owns eight, all targeting
foreign segment 0. There are no named or indexed imports. Dependency name
hashes, excluding NUL, are:

- M0: `ee6cadb27464ba6d3dec936edd9869f69264ebd8e0407ce921f3fe89853f7cfb`
- M1: `16b46d774acaad20090cb54665e9ca0ba6f1edb7fcc741c7ff1f0c131e0fb68f`

The converter retains anonymous imports as deterministic undefined identities
encoding dependency, foreign segment, and foreign segment offset. Those
reversible names are not reproduced here. Their bytewise-sorted identity set,
joined by NUL with one trailing NUL, has hash
`e65cb3fa2d0e300555e226c8f19c6a4ab1dd7bcfe9440d7ac35de6ef6ac425cd`.
Foreign target offsets and association order remain private verification
facts, not guessed public ABI aliases.

There are 56 import patch records: 54 imports own one patch each, and the
global anonymous-table record at zero-based ordinal 46 owns two. The latter
is the descriptor-table identity used at rodata `0x160` and `0x174`. In
total, 52 patches are veneer slots and four are descriptor fields. The three
nonzero external addends, at rodata `0x160`, `0x16C`, and `0x174`, are all
8; the other 53 external addends are zero.

All **123 relocations are type 2 / `R_ARM_ABS32`**, represented as REL with
in-place addends. Original CRO output words were unresolved zeros. Every
output is four-byte aligned, unique, in bounds, and wholly within its output
range. Patch lists terminate canonically, cover all 56 import records without
overlap or orphan records, and reserved relocation bytes pass parser checks.

| Output | Target class | Records | Output bytes |
| --- | --- | ---: | ---: |
| Text | Undefined import | 52 | 208 |
| Text | Internal text | 29 | 116 |
| Text | Internal rodata | 10 | 40 |
| Text | Internal data | 1 | 4 |
| Text | Internal BSS | 1 | 4 |
| Rodata | Undefined import | 4 | 16 |
| Rodata | Internal text | 20 | 80 |
| Rodata | Internal rodata | 6 | 24 |

Thus `56 imported + 67 internal = 123`, and `93 text + 30 rodata = 123`.
There are no output patches in `.data`, BSS, accepted code, or unknown residue.
Internal text targets include table cases, unmatched routines, an initializer
array, and a one-past bound. Internal rodata targets include byte-offset
selectors, descriptors, strings, dispatch address points, and one-past bounds.
The splitter preserves those targets by rebasing addends to the containing
range identity, retaining wrapping arithmetic and text instruction-mode bits.
All declared code ranges here are ARM; rodata byte-offset low bits must remain
ordinary address arithmetic.

Private table verification hashes, without publishing their bulk contents:

- 55 anonymous-import records, 440 bytes:
  `3d3cf0c76a23a9467d102e9c557248b465712b903f7520f289b376ef083a437e`
- 56 import-patch records, 672 bytes:
  `64ae81212d940b1f0f7322d1b091c8ba8b5e17a21e463367f77f0c07afc93e85`
- 67 internal-relocation records, 804 bytes:
  `622b8eade10c14c58e0ddf9f0737d4c81d6aefcc906c63c28a1991bd784d81e4`

## Complete regenerated split ELF and comparison-base metadata

The regenerated target consists of null section 0, the 132 range sections,
and the following complete suffix:

| Indices | Section family | Offset / size rule | Type / alignment |
| --- | --- | --- | --- |
| 133 | `.rodata` | `0x194C`, 576 bytes | PROGBITS A / 4 |
| 134 | `.data` | `0x1B8C`, 4 bytes | PROGBITS WA / 4 |
| 135 | `.bss` | `0x1B90`, 16 bytes | PROGBITS WA / 4 |
| 136 | `.cro.module` | `0x1BA0`, 13 bytes | PROGBITS, no flags / 1 |
| 137–196 | `.rel` plus owning pool-section name | Starts `0x1BB0`; increasing output-pool order; 8 bytes per relocated word in the pool tables above | REL, INFO_LINK / 4 |
| 197 | `.rel.rodata` | `0x1E98`, 240 bytes | REL, INFO_LINK / 4 |
| 198 | `.symtab` | `0x1F88`, 6,208 bytes | SYMTAB / 4, entry size 16 |
| 199 | `.strtab` | `0x37C8`, 3,886 bytes | STRTAB / 1 |
| 200 | `.shstrtab` | `0x46F6`, 5,220 bytes | STRTAB / 1 |

Only 60 of the 64 pools have relocation sections; the four all-scalar pools
have none. The prefix supplies 52 REL sections of size 8. Subsequent REL
sections belong, in order, to pools `0x204`, `0x704`, `0xEE8`, `0x16A8`,
`0x1828`, `0x1864`, `0x187C`, and `0x18F0`, with sizes 80, 80, 8, 40,
24, 8, 40, and 48. Together with rodata this accounts for **61 REL sections**
and 984 bytes. All link to symbol table 198 and identify their exact owner by
`sh_info`; offsets are relative to that owner, not original text offsets.

The target has 201 section headers / 8,040 bytes at `0x5B5C`. There are five
zero fill bytes: `[0x1BAD,0x1BB0)` and `[0x5B5A,0x5B5C)`. File accounting:
`52 header + 7,033 content + 984 REL + 15,314 symbol/string metadata + 5 fill
+ 8,040 section headers = 31,428`.

The 388 symbols comprise null, 136 local section symbols, 131 local mapping
symbols, 64 global pool OBJECTs, one global FUNC, and 55 undefined NOTYPE
imports. The mapping symbols are 65 `$a` (function plus gaps) and 66 `$d`
(pools plus rodata/data). Unknowns, BSS, and module marker have no mapping
symbols. First global is 268; symbol-table link is 199. All symbol visibility
bytes are zero. The split rodata hash after rebasing is
`212b6c8c4e0c629871adf07eaeb120deef6fb6f0269a7f95c5ed255626ce9bce`.

The empty skeleton has **140 sections**: null, the same 132 ranges, then
rodata/data/BSS/marker at indices 133–136, followed by symtab/strtab/shstrtab
at 137–139. All range, rodata, and data sections are NOBITS; BSS is zero-sized
NOBITS. Their file offsets are `0x34`. The marker at `0x34` is its only
PROGBITS payload. It has the same 388 symbol identities and no relocations.
Metadata offsets/sizes are symtab `0x44` / 6,208, strtab `0x1884` / 3,886,
and shstrtab `0x27B2` / 3,408. Its section headers start at `0x3504` and total
5,600 bytes. Zero fill occurs at `[0x41,0x44)` and `[0x3502,0x3504)`.
Accounting: `52 + 13 + 13,502 + 5 + 5,600 = 19,172`.

For the **cached** split target, the content offsets above remain unchanged.
Header ordering inserts each owner's REL header immediately after it;
rodata is index 193 with REL index 194, data/BSS/marker are 195–197, and the
three metadata sections remain 198–200. Symtab is at `0x1BB0` / 6,208,
strtab at `0x33F0` / 3,886, the 984-byte REL payload block at `0x4320`, and
shstrtab at `0x46F8` / 3,652. Section headers start at `0x553C`, totaling
8,040 bytes. Its five zero fill bytes are `[0x1BAD,0x1BB0)` and
`[0x431E,0x4320)`. Accounting:
`52 + 7,033 + 984 + 13,746 + 5 + 8,040 = 29,860`.

The authored base selected by the current objdiff configuration is separate
from the empty skeleton. It has five sections: null, the 224-byte
`.text.func_00000DCC` at `0x34`, `.symtab` at `0x114` / 80 bytes,
`.strtab` at `0x164` / 22 bytes, and `.shstrtab` at `0x17A` / 47 bytes.
It has five symbols and zero relocations. Three zero fill bytes precede
the 200-byte section-header table at `0x1AC`. It owns no pool, data, BSS,
unknown, or marker payload. Its 224-byte executable payload matches the
accepted function hash above.

## Concrete blockers and boundaries of this specification

**This specification is not sufficient for byte-identical reconstruction
under the requested public-data boundary.** Specific missing material is
the exact 64-byte selector vector, the 288-byte integer table, 94 bytes of
authored type-name strings, the opaque scalar identities, and exact foreign
import identities/association order. Counts and hashes verify a candidate
but do not provide an independent construction of these payloads. Changing
names, replacing tables with generic values, or zeroing unknowns/fill changes
the binary. Copying them from the target into implementation would violate
the stipulated separation and publication restrictions. Independent behavior
specifications or separately established public interoperability facts would
be needed before an implementer could author matching content. This is a
concrete information gap; it is not a blanket legal conclusion that every
literal or interface name is inherently unpublishable.

There are also distinct engineering gates at this commit:

- The current authored base covers just 224 bytes. The public report's 100%
  accepted-function score excludes 5,668 gap bytes, 72 unknown bytes, and all
  1,056 data-denominator bytes. Data is `460 pools + 576 rodata + 4 data
  + 16 BSS`; the module remains explicitly incomplete.
- `scripts/prepare-bytematch-report.mjs` requires zero matched CRO data,
  grants credit only to declared accepted function claims, rejects non-text
  credit, and requires CRO `complete: false`. A genuinely reconstructed full
  module would require reviewed reporting-policy changes. This is a concrete
  current **reporting** blocker, not evidence that clean-room data authorship
  is forbidden in principle.
- `scripts/generate-objdiff-config.mjs` requires whole target/base ELF file
  identity and absence of unknown sections for `complete: true`. Retaining
  the current unknown partition defeats that criterion even if its bytes
  were reproduced. The cached/regenerated target discrepancy also makes the
  exact comparison artifact a required explicit choice.
- Contract-10's source gate permits only its one executable body and rejects
  encoded data directives and adjacent ownership. Extending that file to
  absorb pools or data would exceed its approved contract.
- Full CRO identity additionally needs header/loader metadata, export-name
  material, code-blob gaps, nonzero trailer, and the 48-versus-16 BSS allocation
  distinction. Structural/split ELF identity alone is a narrower target.

The report's `.text` section aggregate is 5,892 bytes (accepted body plus
gaps), whereas its accepted-code denominator is 224. Its function `address`
field is 5,668, an objdiff comparison-space address; the authoritative
segment-relative entry remains `0x0DCC` / 3,532 from the CSV. The report
address must not be used as a CRO link address or to relocate this function.

## Exact accounting and completion checklist

Checked items describe evidence established by this analysis, not
implementation credit. Open items are obligations before a full-link claim.

- [x] Pin commit, revision, observation date, tools, public metadata hashes,
  verified CRO size/hash, and input-discovery boundary.
- [x] Account for all 16,384 CRO file bytes, all six segment records, all
  17 table descriptors including empty ones, four digest regions, zero gaps,
  nonzero rodata fill, and 1,984 trailing bytes outside digest coverage.
- [x] Verify the structural ELF against an in-memory CRO conversion; account
  for all 11 sections, 61 symbols, 123 REL records, and four file fill bytes.
- [x] Partition all 6,424 text bytes exactly:
  `224 accepted + 5,668 gaps + 460 pools + 72 unknown = 6,424`.
- [x] Enumerate all 52 repeated veneer/pool pairs and every later range,
  with unambiguous generated names, flags, types, indices, sizes, and alignment.
- [x] Account for all 115 pool words:
  `52 import + 41 internal relocation + 22 scalar = 115`.
- [x] Preserve every unknown interval and hash; distinguish candidate code,
  constants, incoming references, and accepted partition facts.
- [x] Cover all 576 rodata bytes:
  `64 selectors + 288 integer records + 32 descriptors + 94 name strings
  + 2 fill + 96 dispatch tables = 576`.
- [x] Distinguish four initialized data bytes, 16 segment BSS bytes, and the
  header's additional 32 unassigned allocation bytes.
- [x] Account for one named export, two dependency records, 55 anonymous
  imports, 56 import patches, and 67 internal patches without publishing
  authored names or bulk relocation tables.
- [x] Verify `52 + 29 + 10 + 1 + 1 = 93` text patches and
  `4 + 20 + 6 = 30` rodata patches; preserve byte-offset and one-past addends.
- [x] Account for regenerated target's 201 sections / 388 symbols,
  skeleton's 140 sections / 388 symbols, all ELF metadata and fill, cached
  target differences, and the separate five-section authored base.
- [x] Run the selected module's public inventory and target-aware semantic
  gates without changing their accepted classifications.
- [ ] Provide independently reviewable behavior/boundary specifications for
  all unmatched code and resolve each of the three unknown classifications.
- [ ] Supply an approved independently derivable construction for opaque
  selectors, integer records, scalar constants, type-name identities,
  nonzero fill, and exact import/export bindings; hashes alone do not do so.
- [ ] Establish and pin the intended normalized ELF artifact, including
  section ordering, strings, symbols, relocation ordering, headers, and fill.
- [ ] Resolve full-CRO-only metadata obligations and the extra BSS allocation
  if complete cartridge-module reconstruction is the intended claim,
  including both uninterpreted fixed-header intervals and the export tree.
- [ ] Obtain separately reviewed changes to current data/completion reporting
  gates before claiming full-module progress; no such changes are authorized
  or made by this analysis.
- [ ] Have a distinct implementer work from an approved specification and
  independently verify the final complete target; do not conflate this
  analysis with a clean-room implementation.
