# DllUSGymFire: complete-unit analysis specification

## Scope, provenance, and status

This is the **analysis** role's specification of `cro/DllUSGymFire` for Pokémon
Alpha Sapphire `AS_EUR_REV2`. It contains independently recorded interface,
layout, and control-flow observations, not an implementation. Analysis date:
2026-10-17 (UTC). Repository baseline:
`4a07fbcd399281cd0006d8cf3c439e6bc50ec2bb`.

The governing documents are [CLEAN_ROOM.md](../../CLEAN_ROOM.md),
[CRO_TARGET_OBJECTS.md](../../CRO_TARGET_OBJECTS.md), and
[the specifications convention](../README.md). Evidence comprises the public
[unit manifest](../../../progress/units/AS_EUR_REV2.cro.json),
[function CSV](../../../symbols/cro/DllUSGymFire.csv),
[partition](../../../symbols/cro-partitions/DllUSGymFire.json), and a private
module verified against that manifest. Its container size is 16,384 bytes and
SHA-256 is
`583f1587e0a16a61ac49ba0e78e9cbc013202730ea0b14aa6dd23216bb3f26b8`.
The existing private structural target equals a fresh conversion byte for byte.
The root checkout's ignored environment configuration was used only to locate
verification inputs. No private location or configuration value is recorded here.

Tools actually used: Node.js 24.21.0; repository CRO parser/converter, splitter,
inventory validator, and semantic validator at the baseline revision; GNU ARM
objdump 2.45.1.20251203 from Arm GNU Toolchain 15.2.Rel1, with ARMv6K decoding.
The public inventory was originally produced by the repository's Ghidra workflow;
Ghidra was not rerun for this analysis. No SDK headers, leaked source, or external
platform-documentation claims were used. All target-specific facts below are
static observations, not observations of a running game. The compiler's exact
identity and original source spellings are not established.

The specification accounts for the entire link unit, including loader support,
otherwise unclaimed code, data, relocations, and container padding. **It is not an
approval to mark the unit implemented or complete.** The final section identifies
the remaining data/behavior evidence needed for independent implementation.
No source, build definitions, configuration, inventory, or validator was changed.

## Notation and interpretation

All hexadecimal offsets are relative to the named segment, except explicitly
labelled container offsets. Ranges are half open. `T`, `R`, `D`, and `Z` mean
`.text`, `.rodata`, `.data`, and `.bss`. `Fxxxx` is the neutral routine identity
at text offset `0xxxxx`; `Ixxxx` is an imported-function veneer at that offset.
These labels do not assert original source names. `u8`, `u16`, `u32`, `s32`,
and `f32` denote observed access widths and interpretation. Pointer fields are
four bytes. Arithmetic on counters/addresses has the observed 32-bit wrapping
behavior; stage writes retain only the low eight bits.

Calls are described by logical argument order; floating arguments explicitly
marked `s0` use that floating register in the observed interface. `Vn(h, ...)`
means an indirect call through byte offset `n` of the function table obtained
from the first word of object `h`, with `h` as its receiver. No source-language
class declarations or engine operation names are implied. Results whose values
are not consumed are not assigned invented meanings.

`C` denotes the small controller object, `B` the larger owner object, `X` a
context, `E` an entity-like object obtained from `X`, and `H` a controller-like
object obtained from `X`. Names such as "constructor", "resource", "position",
and "type descriptor" describe strongly supported usage patterns; the exact
engine semantics remain outside this unit. Imported callees are opaque beyond
their call-site contracts.

## Container and section inventory

The four real segments have alignment 4 in the structural ELF. Auxiliary segment
slots 4 and 5 are empty. The header requests 48 BSS allocation bytes, whereas the
actual segment-table BSS extent is 16 bytes. The extra 32 bytes are an allocation
allowance, not an additional defined ELF object or initialized payload.

| Segment | Container start | Extent | ELF treatment |
| --- | ---: | ---: | --- |
| T | `0x180` | `0x1918` = 6,424 | allocated, executable |
| R | `0x2000` | `0x240` = 576 | allocated, read-only |
| D | `0x383C` | 4 | allocated, writable, initial zero word |
| Z | no file payload | `0x10` = 16 | allocated, writable, initially zero |

Allocated logical total: **7,020 bytes**; initialized segment payload: **7,004
bytes**. Read-only/writable/zero-initialized data denominator: **596 bytes**.
The structural ELF also has its module identity, symbol/string tables, section
headers, and REL tables. Those are conversion metadata, not additional original
runtime data objects.

The hashed code blob is container `[0x180,0x3000)`, 11,904 bytes. The metadata
region is `[0x3000,0x383C)`, 2,108 bytes. The hashed data blob is
`[0x383C,0x3840)`. The parser verified all four header hash regions, segment
geometry, canonical relocation slots, and ownership of every patch.

| Container metadata object | Start | Count / bytes |
| --- | ---: | ---: |
| module-name identity, NUL terminated | `0x3000` | 13 bytes |
| segment descriptors | `0x3010` | 6 × 12 = 72 |
| named exports | `0x3058` | 1 × 8 |
| export lookup tree | `0x3060` | 2 × 8 |
| export-name storage | `0x3070` | 19 bytes |
| dependency descriptors | `0x3084` | 2 × 20 |
| import patch records | `0x30AC` | 56 × 12 |
| anonymous import records | `0x334C` | 55 × 8 |
| dependency-name storage | `0x3504` | 18 bytes |
| internal relocation records | `0x3518` | 67 × 12 |

Indexed exports, named imports, indexed imports, and both auxiliary relocation
tables are empty. The named-export table has exactly one entry:
`nnroControlObject_ -> T+0x1868`. No data object is exported. The export tree is
loader lookup metadata for that entry; it is not gameplay data or a function
table. The only import dependencies are the static image (`S`) and `DllField`
(`G`). Exact anonymous target identities are listed below.

## Function boundaries and text coverage

The accepted public inventory contains only `func_00000DCC`, ARM, 224 bytes.
It classifies the remaining text as 64 gaps totaling 5,668 bytes, 64 pools
totaling 460 bytes, and three unknown ranges totaling 72 bytes. Thus:
`224 + 5668 + 460 + 72 = 6424`.

The following additional boundaries are analysis findings, **not changes to the
accepted inventory**. All local routines and veneers use ARM instructions. The
odd imported target of `I0190` retains its external interworking indicator.
Routine extents below end after the last instruction; inline data holes are
excluded from the instruction count. Terminal returns, direct branches, dispatch
targets, and relocated function-table references support the decomposition.
`F01B4`, `F0EC0`, and `F1748` have separated instruction bodies and clear
returns but no local reference to their entries; their external reachability
has not been established.

| Entry | End | Instruction bytes | Contract / inline exclusions |
| --- | --- | ---: | --- |
| `I0000 + 8k`, `0 ≤ k < 52` | entry + 4 | 208 total | transfer to imported target; slot at entry + 4 |
| `F01A0` | `0x1B4` | 20 | initialize record's first three words |
| `F01B4` | `0x1CC` | 24 | attach controller context/owner/index/mode |
| `F01CC` | `0x690` | 1,168 | mode-one stage machine; excludes `0x204..0x22C`, `0x608..0x614` |
| `F0690` | `0x698` | 8 | return one |
| `F0698` | `0x69C` | 4 | no-op |
| `F069C` | `0x6A0` | 4 | no-op |
| `F06A0` | `0x6C8` | 40 | dispatch by controller mode |
| `F06C8` | `0xDC8` | 1,724 | mode-zero stage machine; excludes `0x704..0x72C`, `0xBB8..0xBD4` |
| `F0DCC` | `0xEAC` | 224 | attachment lookup and entity transform update |
| `F0EC0` | `0xEE8` | 40 | controller construction after imported base construction |
| `F0EEC` | `0xEFC` | 16 | imported base destruction, then deallocation |
| `F0EFC` | `0xF00` | 4 | tail-call imported base destruction |
| `F0F00` | `0xF04` | 4 | no-op |
| `F0F04` | `0xF08` | 4 | no-op |
| `F0F08` | `0xF10` | 8 | return zero |
| `F0F10` | `0xF18` | 8 | return zero |
| `F0F18` | `0xF20` | 8 | return zero |
| `F0F20` | `0xF24` | 4 | no-op |
| `F0F24` | `0xF2C` | 8 | return zero |
| `F0F2C` | `0xF30` | 4 | no-op |
| `F0F30` | `0xF34` | 4 | no-op |
| `F0F34` | `0x10EC` | 440 | owner resource teardown |
| `F10EC` | `0x16A8` | 1,468 | owner resource creation and placement |
| `F16CC` | `0x1748` | 124 | four-state load progression |
| `F1748` | `0x1828` | 224 | owner construction |
| `F1834` | `0x1838` | 4 | tail-call deallocation |
| `F1838` | `0x183C` | 4 | no-op |
| `F183C` | `0x185C` | 32 | initialize four-float BSS object |
| `F1868` | `0x18F0` | 116 | loader-control export; excludes `0x187C..0x1890` |

There are **29 local routines plus 52 veneers**, with **5,948 instruction
bytes** in total. Dispatch destinations inside `F01CC`, `F06C8`, and `F1868`
are basic-block labels, not additional routines. Embedded pools after routine
returns belong to the surrounding layout, not to the following routine.

The complete non-instruction text inventory is:

| Range | Extent | Interpretation |
| --- | ---: | --- |
| `[8k+4,8k+8)`, `0 ≤ k < 52` | 208 | imported pointer slots |
| `0x204..0x22C` | 40 | first ten-state dispatch pointers |
| `0x608..0x614` | 12 | float zero, event identifier, float one |
| `0x704..0x72C` | 40 | second ten-state dispatch pointers |
| `0xBB8..0xBD4` | 28 | events, floats, and scene-field offsets |
| `0xDC8..0xDCC` | 4 | event identifier |
| `0xEAC..0xEB1` | 5 | opaque four-character lookup token plus NUL |
| `0xEB1..0xEB4` | 3 | zero alignment padding |
| `0xEB4..0xEC0` | 12 | floats 3.5, zero, one |
| `0xEE8..0xEEC` | 4 | controller function-table pointer |
| `0x16A8..0x16CC` | 36 | five internal pointers and floats 18, 9, zero, one |
| `0x1828..0x1834` | 12 | owner table, record initializer, resource descriptor pointers |
| `0x185C..0x1868` | 12 | floats approximately 0.7 and 1; BSS pointer |
| `0x187C..0x1890` | 20 | five loader-operation dispatch pointers |
| `0x18F0..0x1914` | 36 | loader bounds, state pointer, and scalar fallback values |
| `0x1914..0x1918` | 4 | initializer pointer |

These ranges total **476 bytes: 468 literal/pointer bytes, 5 token bytes, and
3 padding bytes**. Together with 5,948 instruction bytes they cover T exactly.
The public unknown ranges refine as follows: `0x1B4..0x1CC` is the helper;
`0xEAC..0xEB4` is token/padding; `0x183C..0x1864` is 32 initializer
instruction bytes followed by 8 scalar-literal bytes. This explains all 72
unknown bytes without silently crediting them as accepted functions.

## Object and data schemas

### Controller C and owner B

| Object | Offset | Observed field |
| --- | --- | --- |
| C | `0x00` | function-table address point `R+0x1E8` |
| C | `0x18` | context X |
| C | `0x1C` | owner B, loaded from `X+0x1A0` during attachment |
| C | `0x20` | signed record index |
| C | `0x24` | mode: 0 or 1 selects a stage machine |
| C | `0x28` | signed delay counter |
| C | `0x2C` | signed secondary counter |
| C | `0x30` | stage byte |
| B | `0x00` | function-table address point `R+0x208` |
| B | `0x04`, `0x08` | supplied context pointer, stored in both fields |
| B | `0x0C` | allocated manager pointer |
| B | `0x10` | load state word |
| B | `0x14` | primary handle |
| B | `0x18..0x24` | group of three handles |
| B | `0x24..0x30` | second group of three handles |
| B | `0x30` | another primary handle |
| B | `0x34..0x3C` | eight bytes not accessed by this unit |
| B | `0x3C`, `0x15C`, `0x27C`, `0x39C` | four arrays A/B/C/D, each 12 records of stride 24 |

Each record has a handle pointer at `+0`, two words at `+4/+8`, and three
position floats at `+0xC/+0x10/+0x14`. The record initializer zeros only the
first three words. The last array ends at owner offset `0x4BC`; that is the
minimum observed owner extent, not a proven source `sizeof`. The minimum
controller extent is `0x31`; imported base fields and final allocation rounding
are not known here.

The updater's record selection computes `B + arrayBase + 24*index` after only
a **signed upper-bound test** `index < 12`. It does not reject negative indices.
Where present, null checks compare the computed record address against zero,
not the record's handle. A zero handle at a nonzero record address is generally
dereferenced. These are observable preconditions, not invitations to insert
new validation or null-tolerant behavior.

Relevant context paths are `X+4` (allocator argument), `X+0x10` (manager
construction argument), `X+0x24/+0x2C` (resource arguments), `X+0x10C`
(field-system pointer), and `X+0x1A0` (owner). `I0000(X)` yields H;
`I0008(X)` yields an object whose word at `+0xC` supplies E. `I00B0(X)`
yields a scene-like object; uses in this unit include its words at `+0x34` and
`+0xAA0`. These paths establish widths and relationships, not full schemas for
objects owned by another unit.

### Read-only objects

| R range | Schema and relationships |
| --- | --- |
| `0x000..0x008` | eight one-byte resource selectors; setup reads index 0 for the primary handle, 1 for the final handle, 3/4 for the first handle group, and 6/7 for the second group |
| `0x008..0x03E` | 18 packed three-byte resource descriptors passed as one opaque block to manager construction; each has two selectors and a flag; all observed flags are one |
| `0x03E..0x040` | two zero alignment bytes |
| `0x040..0x0D0` | position bank P: 12 records of three signed 32-bit coordinates, stride 12 |
| `0x0D0..0x160` | position bank Q: same schema, 12 records |
| `0x160..0x16C` | three pointer words: external type-support address, local name object, external base descriptor |
| `0x16C..0x174` | two pointer words: external type-support address and local name object |
| `0x174..0x180` | three pointer words: external type-support address, local name object, descriptor at `R+0x16C` |
| `0x180..0x19B` | opaque linkage/type-name object, 26 characters plus NUL |
| `0x19B..0x1B9` | opaque linkage/type-name object, 29 characters plus NUL |
| `0x1B9..0x1DE` | opaque linkage/type-name object, 36 characters plus NUL |
| `0x1DE..0x1E0` | 16-bit all-ones residue; not treated as a pointer or instruction |
| `0x1E0..0x1E8` | controller table header: zero displacement word, pointer to descriptor `R+0x160` |
| `0x1E8..0x200` | six controller function pointers |
| `0x200..0x208` | owner table header: zero displacement word, pointer to descriptor `R+0x174` |
| `0x208..0x240` | fourteen owner function pointers |

There are no omitted R bytes. Both coordinate banks contain twelve distinct
triples. Setup converts each signed component to `f32`; horizontal components
are multiplied by 18 and then increased by 9, while the middle component is
converted without scaling. A and D use P; B and C use Q. This relationship is
the interoperability contract. The selector vectors, descriptor contents,
coordinate triples, and original text spellings are deliberately not copied.
The three-byte descriptor field meanings beyond observed selectors/flag are
unresolved; no proprietary resource format is inferred from their packing.

D is one initially zero word used by loader control as mutable state. Z is four
floats, initially zero by allocation; `F183C` writes the first pair to the
single-precision value nearest 0.7 and the second pair to 1.0. No other local
reference to Z exists. Its gameplay meaning is unestablished.

## Exact imports and relocation ownership

Every relocation is `R_ARM_ABS32`, corresponding to a canonical type-2 CRO
patch. In symbolic expressions below, addition is 32-bit linker arithmetic.
There are **123 output words: 56 imported and 67 internal**. T owns 93 words
(52 imported, 41 internal); R owns 30 (4 imported, 26 internal); D and Z own
none. Every output is four-byte aligned and unique. No instruction owns a
relocation output.

`S:segment:offset` identifies an anonymous import from the static-image
dependency; `G:segment:offset` identifies one from `DllField`. These are exact
symbolic identities, not estimated callees. The converter's ELF spelling is
`__cro_import_anon_m<dependency UTF-8 hex>_s<segment>_<seven-hex-digit offset>`;
dependency encodings are `7c7374617469637c` for S and `446c6c4669656c64` for G.
Offsets retain the low interworking bit where present.

For every veneer row, the **sole output slot is `T + veneer + 4`**, target is
the stated import, and addend is zero. Each veneer transfers control to its
slot's resolved target without changing the incoming argument interface or
adding a call frame. Its callers receive the imported routine's result.

| Veneer | Anonymous target | Observed call-site contract |
| --- | --- | --- |
| `I0000` | `G:0:0x008BE50` | X -> H |
| `I0008` | `G:0:0x00E5BA0` | X -> object containing E at +0xC |
| `I0010` | `S:0:0x02F6BDC` | (H, command selector) |
| `I0018` | `S:0:0x02F71F0` | H -> predicate |
| `I0020` | `S:0:0x002BB5C` | selector 9 -> argument for I0028 |
| `I0028` | `S:0:0x02F6494` | (H, I0020 result) |
| `I0030` | `S:0:0x02F87B8` | (E, integer mode, integer option), s0=float |
| `I0038` | `S:0:0x02F81C0` | E -> predicate |
| `I0040` | `S:0:0x02F131C` | (E, mask), operation A |
| `I0048` | `S:0:0x034FA84` | (event ID, 0, -1, 0) |
| `I0050` | `S:0:0x02716C4` | (0, 0, 15, 0) |
| `I0058` | `S:0:0x0270778` | predicate; no new argument prepared |
| `I0060` | `S:0:0x02F1618` | (E, mask), operation B |
| `I0068` | `S:0:0x027128C` | (0, 15) |
| `I0070` | `S:0:0x02F671C` | H, completion operation |
| `I0078` | `S:0:0x03E3FC8` | E -> predicate |
| `I0080` | `S:0:0x03E3D8C` | E -> secondary entity object |
| `I0088` | `G:0:0x00DB150` | I0080 result -> predicate |
| `I0090` | `S:0:0x03DBDB4` | E -> selector passed to I0098 |
| `I0098` | `S:0:0x02FAE48` | (E, 57, I0090 result) |
| `I00A0` | `S:0:0x02F130C` | (E, 0x800000), operation A |
| `I00A8` | `G:0:0x0086C3C` | (I0080 result, boolean-like 0/1) |
| `I00B0` | `G:0:0x00E5B70` | X -> scene |
| `I00B8` | `S:0:0x03EDC4C` | (scene actor +0x1A4, output payload) |
| `I00C0` | `S:0:0x0383110` | output header initialization |
| `I00C8` | `S:0:0x0044D28` | (destination, source, 38), copying payload |
| `I00D0` | `S:0:0x0383EE4` | (actor subsystem, prepared header) |
| `I00D8` | `S:0:0x03DC688` | (E, output three-float position) |
| `I00E0` | `G:0:0x0086D78` | (output transform, field +0x7C value, field, descriptor) |
| `I00E8` | `S:0:0x02F234C` | (E, transform) |
| `I00F0` | `S:0:0x02F2DFC` | E, transform follow-up |
| `I00F8` | `S:0:0x0383E14` | (actor subsystem, 0) |
| `I0100` | `S:0:0x02F4910` | (E, 0x800000), operation B |
| `I0108` | `G:0:0x007E01C` | X+0x10C field pointer -> predicate |
| `I0110` | `G:0:0x0088B44` | I0080 result -> float in s0 |
| `I0118` | `S:0:0x0009434` | base construction, r0 result used as receiver |
| `I0120` | `S:0:0x00E8294` | base destruction |
| `I0128` | `S:0:0x01FF8C0` | deallocation |
| `I0130` | `S:0:0x0352EE0` | manager destruction |
| `I0138` | `S:0:0x03529F8` | (manager, 0, X+0x2C value, -1; stack: X+0x24 value) |
| `I0140` | `S:0:0x0023480` | (allocation size, X+4 value) -> pointer or zero |
| `I0148` | `S:0:0x0281CBC` | construct allocation requested with size 16 |
| `I0150` | `S:0:0x0352160` | (manager, word(X+0x2C), word(X+0x24), resource byte; stack: handle) |
| `I0158` | `S:0:0x0281B00` | construct allocation requested with size 28 |
| `I0160` | `S:0:0x0352484` | (manager, word(X+0x2C), word(X+0x24), selector; stack: record address, handle-group address, count, 0) |
| `I0168` | `S:0:0x02964E8` | (record handle, position address) |
| `I0170` | `S:0:0x028B374` | (scene+0x34 value, handle, 0) |
| `I0178` | `S:0:0x028B69C` | same arguments, separate operation |
| `I0180` | `S:0:0x0352E54` | (manager, 272, 0), load request |
| `I0188` | `S:0:0x03525B4` | manager -> readiness predicate |
| `I0190` | `S:0:0x000018D` | (array base, F01A0, stride 24, count 12); caller treats result as array base |
| `I0198` | `S:0:0x0352E74` | (allocation, allocator argument, X+0x10 value, 18; stack: R+8, 8), manager construction |

The three non-veneer import identities and all their ownership are:

| Output | Target + addend |
| --- | --- |
| `R+0x160` | `S:1:0x005A468 + 8` |
| `R+0x168` | `S:1:0x0045DF8 + 0` |
| `R+0x16C` | `S:1:0x005A458 + 8` |
| `R+0x174` | `S:1:0x005A468 + 8` |

The following symbolic pointer assignments specify **all 67 internal
relocations**. They describe link relationships, not copied gameplay tables.

| T output slot(s) | Symbolic target(s), in slot order |
| --- | --- |
| `0x204 + 4j`, `0 ≤ j < 10` | T labels `0x22C, 0x244, 0x28C, 0x2C0, 0x354, 0x3B4, 0x470, 0x4E0, 0x50C, 0x65C` |
| `0x704 + 4j`, `0 ≤ j < 10` | T labels `0x72C, 0x784, 0x7B0, 0x85C, 0xA7C, 0xAB0, 0xBF0, 0xC9C, 0xCF8, 0xD54` |
| `0xEE8` | `R+0x1E8` |
| `0x16A8, 0x16AC, 0x16B0, 0x16B4, 0x16B8` | `R+0, R+2, R+5, R+1, R+0x40` |
| `0x1828, 0x182C, 0x1830` | `R+0x208, T+0x1A0, R+8` |
| `0x1864` | `Z+0` |
| `0x187C + 4j`, `0 ≤ j < 5` | T labels `0x1890, 0x1898, 0x18A0, 0x18AC, 0x18BC` |
| `0x18F0` | `D+0` |
| `0x18F8, 0x18FC` | `T+0x1914, T+0x1918` |
| `0x1900, 0x1904` | `R+0x240, R+0x240` |
| `0x1914` | `T+0x183C` |

| R output slot(s) | Symbolic target(s), in slot order |
| --- | --- |
| `0x164, 0x170, 0x178, 0x17C` | `R+0x180, R+0x19B, R+0x1B9, R+0x16C` |
| `0x1E4` | `R+0x160` |
| `0x1E8, 0x1EC, 0x1F0, 0x1F4, 0x1F8, 0x1FC` | `F0EFC, F0EEC, F0690, F069C, F06A0, F0698` |
| `0x204` | `R+0x174` |
| `0x208, 0x20C, 0x210, 0x214, 0x218, 0x21C, 0x220` | `F1838, F1834, F16CC, F10EC, F0F30, F0F2C, F0F00` |
| `0x224, 0x228, 0x22C, 0x230, 0x234, 0x238, 0x23C` | `F0F20, F0F34, F0F18, F0F24, F0F08, F0F10, F0F04` |

The one-past T/R bounds in loader metadata are intentional. No missing local
function is inferred at those addresses. Internal branch destinations and
PC-relative token references are not loader relocations. No direct-call
relocation is synthesized for the locally resolved veneer calls.

## Per-routine behavior

### Small routines and construction

`F01A0(record)` writes zero words at offsets 0, 4, and 8, leaving its position
triple untouched. It preserves the incoming receiver in r0. It is the callback
for all four array constructions.

`F01B4(C, X, index, mode)` stores X at C+0x18, reads B from X+0x1A0, then
stores B/index/mode/zero at C+0x1C/+0x20/+0x24/+0x28. It does not reset the
stage or secondary counter. Its observed r0 on return is C+0x1C; a source-level
return type cannot be established from that incidental value alone.

`F0EC0` calls `I0118` with the incoming constructor interface, uses its returned
receiver, installs R+0x1E8 at offset zero, and clears words +0x18, +0x1C,
+0x2C and the stage byte +0x30. Other fields retain base-constructor/caller
state. It returns that receiver. `F0EFC` delegates destruction to `I0120`.
`F0EEC` calls `I0120` then tail-calls `I0128` with the resulting r0. No local
code guarantees a receiver return from either destructor.

`F0690` returns one. `F0F08`, `F0F10`, `F0F18`, and `F0F24` return zero.
`F0698`, `F069C`, `F0F00`, `F0F04`, `F0F20`, `F0F2C`, `F0F30`, and `F1838`
return immediately without local side effects and preserve the incoming r0.
`F1834` tail-calls `I0128`. These entries remain distinct even where their
behavior is equal; each has its own function-table ownership above.

`F06A0(C)` reads the mode at +0x24. Mode 1 delegates to `F01CC`; mode 0
delegates to `F06C8`. Every other value returns zero and leaves stage unchanged.
The mode-zero path is a shared continuation; it is not an extra function
between F06A0 and F06C8.

### Shared updater conventions

At entry, each updater fetches H=`I0000(C.context)` and
E=`word(I0008(C.context)+0xC)` before dispatching on the stage byte. An unsigned
stage outside 0..9 returns zero. Each nonterminal step performs at most one
stage case per invocation. "Advance" below increments the stage byte once and
returns zero. "Wait" returns zero with the stage unchanged. Completion returns
one without incrementing the stage. Named operations preserve their call order;
they are not promises about an imported engine's internal behavior.

For a valid selected record, `h` is its handle. `V72(h,b)` is a boolean-like
handle operation, `V204(h,k,f)` and `V212(h,k,f)` take selector k and f in s0,
and `V244(h,k)` returns a predicate. The locally observed selector values are
0, 1, and 2. `V256(h,1,1)` has two integer arguments. Repeated calls reload the
handle from its record, so an imported callback's mutation is observable.

### F01CC: mode-one updater

| Stage | Behavior |
| --- | --- |
| 0 | `I0010(H,34)`; advance. |
| 1 | Wait unless `I0018(H)` is nonzero. Then `I0028(H,I0020(9))`, `I0030(E,0,0;s0=0)`; advance. |
| 2 | Wait unless `I0038(E)` is nonzero. Then `I0030(E,1,1;s0=0)`; advance. |
| 3 | Apply I0040 to E with masks `0x800`, then `0x2000000`; emit event `0xA0176`. If selected C-array record address is valid, call V72(h,1), V212(h,2,1), V204(h,2,0). Advance even if index/address selection failed. |
| 4 | Wait if C-array selection fails. Otherwise `F0DCC(B,record)` then V244(h,2); wait if zero. When nonzero call `I0050(0,0,15,0)` and advance. |
| 5 | Wait unless I0058 is nonzero. Apply I0060 masks `0x800`, `0x2000000`. For a selected D record call V72(h,1), V212(h,0,1), V204(h,0,0). For a selected A record call V72(h,0). Advance. The same signed index supplies both records. |
| 6 | Apply I0040 masks `0x800`, `0x2000000`. For a selected D record call F0DCC(B,record), then V244(h,0); if nonzero also V72(h,0). Advance regardless of selection or predicate result. |
| 7 | Increment signed C+0x28. Wait while the signed result is at most 15. On exceeding 15 call I0068(0,15) and advance. |
| 8 | Wait if D selection fails. Call F0DCC(B,Drecord), then V244(h,0); wait if zero. Hide D via V72(h,0). If A selection succeeds call V72(Ah,1). If C selection succeeds, call V204(Ch,1,0), V204(Ch,2,0), V212(Ch,1,1), V212(Ch,2,0), V72(Ch,1). Apply I0060 masks `0x800`, `0x2000000`; call I0030(E,2,0;s0=0); advance. |
| 9 | Wait unless I0038(E) is nonzero. Then I0070(H), return one. |

The stage-6 unconditional advance and stage-8 wait are deliberately different.
The delay counter is not reset by this routine.

### F06C8: mode-zero updater

| Stage | Behavior |
| --- | --- |
| 0 | Wait unless I0078(E) is nonzero. Then call I0088(I0080(E)); wait if its result is nonzero. Otherwise call I0098(E,57,I0090(E)) and advance. |
| 1 | Wait unless I0078(E) is nonzero; then I0010(H,7), advance. |
| 2 | Wait unless I0018(H) is nonzero. Emit event `0xA0177`. On valid A selection call V72(Ah,1), V212(Ah,0,1), V204(Ah,0,0); on valid D selection call V72(Dh,0). Advance. |
| 3 | Increment C+0x2C; on exactly 3 apply I0040(E,0x1000000). Wait if A selection fails or V244(Ah,0) is zero. Otherwise perform the stage-3 transition described below, then advance. |
| 4 | Wait unless I0038(E) is nonzero. Then I0050(0,0,15,0), advance. |
| 5 | Wait unless I0058 is nonzero. If A selection succeeds call V204(Ah,0,0), V212(Ah,0,0), V72(Ah,1). Call I00F8 on actor subsystem with zero. Apply I0060(E,0x20000), I0100(E,0x800000), I00A8(I0080(E),1), then I0060 masks `0x800`, `0x2000000`, `0x1000000`. Call F0DCC(B,Crecord) if selection succeeds, otherwise F0DCC(B,0). Advance. |
| 6 | Perform the payload and scene-field part of stage 3 again, using fresh imported reads and temporary buffers; advance. |
| 7 | Wait while I0108(word(X+0x10C)) is nonzero. Otherwise I00F8(actor subsystem,0), I0068(0,15), I0030(E,0,0;s0=0); advance. |
| 8 | Wait unless I0058 is nonzero. Read f=I0110(I0080(E)); if its **bit pattern** equals that of f32 15.0, emit event `0xA001B`. Advance regardless of that comparison. |
| 9 | Read f=I0110(I0080(E)); emit event `0xA001B` on the same bitwise equality to 15.0. Wait unless I0038(E) is nonzero. Then I0070(H), return one. |

Stage 3, after its A-record predicate succeeds, does the following in order:

1. Apply I0040 masks `0x800`, `0x2000000`, `0x20000`; apply
   I00A0(E,0x800000); call I00A8(I0080(E),0).
2. Obtain scene via I00B0(X), actor=`word(scene+0xAA0)`, and
   subsystem=`actor+0x1A4`. Prepare a 38-byte payload via I00B8 and a header
   via I00C0. Two bytes at payload +36/+37 are zero before I00B8; header +12
   is zero before I00C0; header halfword +2 is set to one after I00C0. Copy
   38 payload bytes to subsystem and subsystem+40 via two I00C8 calls, then
   call I00D0(subsystem,header). Other header fields come from I00C0; locally
   unwritten buffer bytes are not assigned invented zero values.
3. Obtain a fresh scene via I00B0(X). Store halfword 2 at scene+0xBC8.
   If signed byte scene+0xE54 is not -1, clear bytes +0xE54 and +0xE55.
   If signed byte scene+0x1250 is not -1, clear byte +0x1250.
4. Read E's position via I00D8. Subtract f32 216.0 from its middle component.
   Prepare the transform descriptor described under F0DCC, using that position;
   call I00E0 with field=`word(X+0x10C)` and its +0x7C value, then
   I00E8(E,transform), I00F0(E). Set byte +0x29E of I0080(E)'s returned object
   to one.
5. Call I0028(H,I0020(9)), I0030(E,0,0;s0=0), and emit event `0xA000D`.

Stage 6 repeats only steps 2 and 3. Step 2 uses different stack locations in
the two stages, but the same buffer sizes, explicit field writes, and imported
interfaces. This routine does not reset its secondary counter. Events in stage
9 can repeat across invocations; no local one-shot guard exists.

### F0DCC: attachment-driven transform

Inputs are owner B and nullable record pointer. A zero record pointer returns
immediately without dereferencing B. Otherwise, obtain h from record+0 and
call V92(h, lookup-token-address T+0xEAC). Pass its result to V104(h,result).
If the second call returns zero, return without entity/field operations.
Otherwise let N be the returned node-like object.

Read X from B+8 and E via I0008(X). Prepare position components from N+0xC,
N+0x1C, and N+0x2C, adding f32 3.5 to the middle component. Prepare a temporary
descriptor with a zero halfword at +0, the three position floats at +4/+8/+0xC,
and six floats occupying +0x14 through +0x28.
Bytes +2/+3 and word +0x10 are not initialized locally; no callee reads of them
are proven by this unit. The six-float field is exactly
`(+0x14=0, +0x18=0, +0x1C=1, +0x20=0, +0x24=1, +0x28=0)`;
the occupied descriptor ends at +0x2C. This explicit layout, rather than a
geometric interpretation of its axes, controls interoperability.

Call I00E0(output, word(field+0x7C), field, descriptor), where
field=`word(X+0x10C)`, then I00E8(E,output), I00F0(E), and
I0080(E). Store byte one at +0x29E of that final result. No local error recovery
or handle/node lifetime management is present. The routine's return value after
nontrivial work is not a defined boolean contract.

### F1748: owner construction

Inputs are owner storage B and context X. Install table address point R+0x208,
store X at +4, and clear load state +0x10. For each of the four arrays call
I0190(base,F01A0,24,12), in A/B/C/D order. The caller treats each return as
the supplied array base: its next array argument is 288 bytes later. Then
store X at +8.

Allocate 64 bytes via I0140(64,word(X+4)). If nonzero, construct the manager
with I0198(allocation,word(X+4),word(X+0x10),18; stack R+8,8). Store its result,
or zero on allocation failure, at B+0xC. Clear B+0x10 and all handle words
from +0x14 through +0x30. Return B. Array position triples and the eight-byte
owner gap are not initialized by local code. Construction does not start
loading or instantiate the record handles.

### F16CC: load progression

Read the word B+0x10. For state 0 call I0180(manager,272,0), increment the
state, and return zero. In state 1 call I0188(manager); return zero without
advancing if its result is zero, otherwise increment state and return zero.
In state 2 set the state to 3 and return zero. In state 3 return one without
changing it. Other states return zero unchanged. A zero manager is not checked.

### F10EC: owner setup and placement

Call I0138 with manager and context values specified in the import table.
Create the following handles, testing each allocation result before its imported
constructor but continuing setup if allocation failed:

| Owner destination | Allocation / construction | Resource binding |
| --- | --- | --- |
| `+0x14` | 16 bytes / I0148 | I0150, selector R[0] |
| `+0x18` | zero directly | no binding |
| `+0x1C` | 28 bytes / I0158 | I0150, selector R[3] |
| `+0x20` | 16 bytes / I0148 | I0150, selector R[4] |
| `+0x24` | zero directly | no binding |
| `+0x28` | 28 bytes / I0158 | I0150, selector R[6] |
| `+0x2C` | 16 bytes / I0148 | I0150, selector R[7] |
| `+0x30` | 16 bytes / I0148 | I0150, selector R[1] |

The two binding loops perform work at group indices 1 and 2, skipping the null
slot at index 0. Their control flow also contains an index-zero skip branch,
which is not reached from the initial loop values. Null allocation results are
stored and passed onward; there is no whole-setup rollback or early return.

For each index 0..11, invoke I0160 for A then B, with resource selectors 8 and
10, handle-group addresses B+0x14 and B+0x18, and counts 1 and 3 respectively.
Then, in a second 0..11 loop, do C then D, using selectors 12 and 11,
handle-group addresses B+0x24 and B+0x30, and counts 3 and 1. Each call passes
the appropriate record address and a final stack zero.

Obtain scene via I00B0(X), retain its +0x34 value, and transform P/Q coordinate
triples into positions as specified above. In an index 0..11 loop configure A
then B; in another index 0..11 loop configure C then D. For each record call
I0168(handle,position), I0170(sceneValue,handle,0), and
I0178(sceneValue,handle,0), then the following virtual operations:

| Array | Position source | Operations after I0178, in order |
| --- | --- | --- |
| A | P | V72(h,1), V212(h,0,0) |
| B | Q | V72(h,0), V212(h,1,0), V212(h,2,0) |
| C | Q | V72(h,1), V212(h,1,1), V212(h,2,0), V256(h,1,1) |
| D | P | V72(h,0), V212(h,0,0) |

There are no handle null checks in these placement loops. Do not infer that
setup is safe after allocation failure merely because allocation is checked
before construction. No meaningful return value is established.

### F0F34: owner teardown

For B+0x14, then the three words B+0x18/+0x1C/+0x20, then the three words
B+0x24/+0x28/+0x2C, then B+0x30: if a handle is nonzero call V16(handle),
reload its owner slot, and if still nonzero call V4(handle). These primary
slots are not locally cleared. Callback mutation of the slot can suppress the
second call.

For indices 0..11 release A[i] then B[i]; in a second loop release C[i] then
D[i]. Each release checks the handle, calls V4 if nonzero, then explicitly
zeros the record's handle word. Record words +4/+8 and positions are untouched.
Finally, if manager is nonzero, call I0130(manager), then I0128 with its return
value. Clear B+0xC in all cases. No local destructor of B itself or automatic
load-state reset occurs here. Return value is unspecified.

### F183C and F1868: module runtime support

`F183C` initializes Z as described above and returns its address in r0. It is
the sole initializer entry in `[T+0x1914,T+0x1918)`. The finalizer interval is
the empty interval `[R+0x240,R+0x240)`. These are bounds, not null pointer arrays.

`F1868`, exported under `nnroControlObject_`, takes a pointer/value argument in
r0 and an unsigned operation in r1. It obtains the address D+0 before dispatch.

| Operation | Effect / result |
| --- | --- |
| 0 | Store zero to the output word at r0; return zero. |
| 1 | Store incoming r0 into D+0; return zero. |
| 2 | Store current D+0 into the output word at r0; return zero. |
| 3 | Store initializer begin/end bounds at output +0/+4; return zero. |
| 4 | Store finalizer begin/end bounds at output +0/+4; return zero. |
| unsigned ≥5 | No output store; return scalar `0xD8E12C21`. |

The default path reads scalar literals `0x30000000` and `0x30000026` on the
way to the final return, without making a call or adding an observable memory
write. They are local runtime residue, not additional imports or event IDs.
This routine does not invoke the initializer itself. Its caller is responsible
for interpreting returned bounds. Output pointers are not validated.

## Padding, residue, and total reconciliation

All runtime segments are fully classified above. The unit contains no discovered
Thumb-local island, unowned relocation, unbounded dispatch table, or extra BSS
object. The 16-bit all-ones R residue is retained as data with unknown purpose;
it is not silently discarded. Descriptive type/name schemas do not establish
original source type identity.

The complete container partition, including bytes outside real segments, is:

| Container range | Bytes | Accounting |
| --- | ---: | --- |
| `0..0x80` | 128 | four hash digests |
| `0x80..0x138` | 184 | CRO header and table directory |
| `0x138..0x180` | 72 | verified zero header alignment |
| `0x180..0x1A98` | 6,424 | T |
| `0x1A98..0x2000` | 1,384 | verified zero code-blob alignment |
| `0x2000..0x2240` | 576 | R |
| `0x2240..0x3000` | 3,520 | verified zero code-blob alignment |
| `0x3000..0x383C` | 2,108 | metadata: 2,102 table bytes plus 6 alignment bytes |
| `0x383C..0x3840` | 4 | D |
| `0x3840..0x4000` | 1,984 | uniform nonzero container fill, outside segment/hash-data extent |

Sum: **16,384**. The metadata alignment ranges are
`0x300D..0x3010` (3), `0x3083..0x3084` (1), and `0x3516..0x3518` (2), all
zero. The trailing fill is a repeated fill value, not an unexplained asset or
hidden code region; its value is not reproduced. It is not emitted by the
structural target converter and does not count toward runtime matching.

The complete R schema adds to 576 bytes; D contributes 4 and Z contributes 16.
The 81 routine/veneer instruction extents and non-instruction text ranges are
nonoverlapping and cover exactly `[0,0x1918)`. Relocation groups add to
`52 + 4 + 41 + 26 = 123`; imports identify 52 code targets and 3 data targets,
with one data target owning two slots.

## Validation, completeness checklist, and concrete limits

Validation performed on the verified unit:

- [x] Module size/SHA-256 agree with the public AS_EUR_REV2 manifest.
- [x] CRO parser verifies all four hash regions, tables, real segment geometry,
  import ownership, patch end markers, and unique type-2 relocation outputs.
- [x] Fresh conversion equals the existing private structural target.
- [x] Public CSV validator passes: 1 function, 224 bytes, 3.49% conservative
  text coverage.
- [x] Target-aware semantic validator passes: 1 function, 64 pools, 93 text
  relocations. This gate validates the existing accepted inventory only.
- [x] Existing splitter accepts the complete public partition in memory.
- [x] Converter and splitter synthetic self-tests pass; no validators modified.
- [x] `npm run check:clean` passes, including the tracked-file safety scan and
  its configured validators. The new specification was additionally screened
  for private paths and raw-assembly blocks.
- [x] All real sections, auxiliary empty segments, header allocation allowance,
  container tables, padding, and residue are accounted for.
- [x] Every identified local routine/veneer has a boundary and neutral contract;
  every dispatch case and function-table slot has an owner.
- [x] All 123 relocation expressions, 55 anonymous import identities, and the
  sole named export are specified symbolically.
- [x] Literal/data object shapes, indexing, transformations, and ownership are
  described without copying strings or bulk scalar tables.
- [x] Text, R/D/Z, metadata, and whole-container totals reconcile independently.
  A separate document audit parsed all import/internal pointer tables and
  compared their 123 target/addend expressions against the verified target;
  it also checked every claimed instruction extent against ARMv6K decoding.
- [ ] New routine boundaries have received an independent review and acceptance
  into the public inventory. This analysis does not perform that promotion.
- [ ] Opaque data has an independently usable source for implementation.
- [ ] Imported engine effects and gameplay behavior have runtime confirmation.

**Concrete implementation blocker:** exact resource selectors, the 18 resource
descriptors, 24 coordinate triples, the attachment lookup token, and type-name
spellings are not supplied as copied target content. They have explicit object
identities and schemas above, but a separate implementer needs independently
authorized data or a separately reviewed semantic description that resolves
those identities. In particular, replacing the lookup token with an arbitrary
name can change F0DCC's result; inventing coordinate values can change placement.
No exact-data or full behavioral-equivalence claim is justified by this document
alone.

**Evidence limit:** engine operations are anonymous imports with call-site
interfaces, not fully specified callees. No live execution, callback-mutation
test, resource binding trace, or whole-module equivalence test was performed in
this analysis. The local control flow and data accesses are specified, including
failure paths and suspicious unchecked accesses, but inferred gameplay labels
must not be substituted for those observable contracts. The purpose of the
two-byte R residue and external entry status of F01B4/F0EC0/F1748 remain unknown.

No implementation, matching-credit update, commit, or broader-unit analysis is
part of this contribution.
