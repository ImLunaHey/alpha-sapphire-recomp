# DllTestPGL complete-unit analysis specification

Contribution role: **analysis only**, for `AS_EUR_REV2`, `cro/DllTestPGL`.
Observation date: 2026-10-17. Repository baseline and observed HEAD:
`4a07fbcd399281cd0006d8cf3c439e6bc50ec2bb`.

This specification follows [the clean-room protocol](../../CLEAN_ROOM.md).
It records static observations and neutral interface facts for a separate
implementer. It does not approve an implementation or claim a completed unit.
No implementation source, ownership configuration, build integration, validator,
public inventory, or report was changed during this analysis.

## Evidence and provenance

The authoritative published snapshot is
[`progress/reports/AS_EUR_REV2/report.json`](../../../progress/reports/AS_EUR_REV2/report.json).
Its DllTestPGL entry agrees with the existing private local report: one accepted
8-byte function, 8 matched code bytes, 148 data bytes, no matched data, and
`metadata.complete: false`. The reported 100% code/function match applies to that
single accepted boundary. Its function address `116` is a split-object layout
coordinate, not the original text-relative entry; the CSV entry is zero.

Evidence inputs and checks:

- The root checkout's ignored `.env.local` was the sole locator for private
  inputs. No environment values or private locations are reproduced here.
- The complete ROM's size and SHA-256 were checked against
  [`config/targets/AS_EUR_REV2.json`](../../../config/targets/AS_EUR_REV2.json);
  both agreed. No ROM extraction was performed during this analysis.
- The module was independently checked against
  [`progress/units/AS_EUR_REV2.cro.json`](../../../progress/units/AS_EUR_REV2.cro.json):
  8,192 bytes, SHA-256
  `fb9e8cbfe4ccb8d3c223de909fb5576b2cf67af73598afa1296ebf8622faeeaa`.
- The repository's `parseCro` verified all four CRO hash regions and structural
  constraints. `buildCroTargetElf` reproduced the existing private structural
  target object exactly. Its SHA-256 is
  `5014ca3b3b5b8b6da864f72e5fd2f1d6922a16899aa18d3850e8c1122b162a9c`.
- Read-only conventions included `docs/specs/README.md`,
  `docs/CRO_TARGET_OBJECTS.md`, the public function/partition inventories,
  the CRO converter/splitter, semantic gate, Ghidra exporters, and an existing
  CRO specification example. No unrelated unit's private target was inspected.

Tools actually used: Node.js **v24.21.0** (filesystem, SHA-256, CRO parser,
deterministic conversion, and analysis-only data-flow evaluation), GNU ARM
objdump **2.44**, and Nix **2.31.3**. Binutils came from the repository's pinned
`.#binutils` package. Ghidra exporter source was read, but Ghidra was not run;
no Ghidra version or fresh automated inventory result is claimed. No compiler,
proprietary SDK source/header, target CPU, or game runtime was used.

Private decoding and analysis scratch stayed outside the checkout and was
removed. Only neutral observations and cryptographic identities are retained.
The small analyzer-written evaluator followed decoded operations; it checks the
consistency of the schedules below, rather than independently proving hardware
execution or application-level meaning.

## Coordinates and complete text accounting

All following code and pool offsets are relative to the original `.text`.
Intervals are half-open. All executable instructions are ARM state, four-byte
aligned; there is no Thumb code, external-call veneer, or unresolved text
residue. Three logical functions occupy **248 executable bytes**. Their pools
occupy **116 bytes**, accounting for all **364 bytes** of the text segment.

| Text interval | Bytes | Classification and evidence |
| --- | ---: | --- |
| `[0x000, 0x008)` | 8 | F0, exported byte-store leaf; accepted public function |
| `[0x008, 0x084)` | 124 | F1, address-taken floating-data initializer; straight-line body ending in return |
| `[0x084, 0x0BC)` | 56 | F1 literal pool: twelve 32-bit scalar slots and two relocated pointers |
| `[0x0BC, 0x0D0)` | 20 | F2 dispatcher prefix; exported and named by the CRO primary entry field |
| `[0x0D0, 0x0E4)` | 20 | Five relocated internal dispatch destinations |
| `[0x0E4, 0x144)` | 96 | F2 cases, common success return, default path, and default return |
| `[0x144, 0x16C)` | 40 | Six relocated pointers and four 32-bit scalar slots, including one initializer-array pointer |

F2 is one logical function whose executable body is the union of two intervals:
`[0x0BC, 0x0D0)` and `[0x0E4, 0x144)`. It has **116 code bytes**, with an
overall extent of **136 bytes** containing a 20-byte dispatch table. The case
labels inside it are not independent callable functions. F1's evidence is its
returned initializer-array address, described below, rather than a direct call.

There are no residual code gaps, padding instructions outside these bodies, or
unexplained bytes inside `.text` after this classification. This is an analysis
finding; the published CSV/partition were deliberately left unchanged.

## F0: exported byte-store leaf

Entry `0x000`, size 8. Inputs are a writable base address and a byte value in
the first two integer argument positions. Store the low eight bits of the
second argument at `base + 217`, then return. No bounds or null check is made.
The first argument register is unchanged. No stack, pool, relocation, or call
is used. A source-level return-value contract beyond those machine effects is
not inferred.

## F1: module floating-data initializer

Entry `0x008`, size 124. No argument is consumed. Let `B` be the `.bss` base,
obtained through the pointer slot at `0x08C`. Let `C(o)` mean the opaque 32-bit
scalar at text offset `o`; this notation identifies a dependency, not its
literal value. The twelve distinct slots contain finite binary32 patterns.
They are copied through floating-point working registers without arithmetic
or conversion.

The instruction-neutral operation schedule, preserving memory-write order, is:

1. Read `C(0x084)`, `C(0x088)`, and `C(0x098)`. Write `C(0x084)` to
   `B + 0` and `B + 4`; write `C(0x088)` to `B + 8` and `B + 12`.
2. Read `C(0x090)`, `C(0x094)`, and `C(0x0AC)`. At consecutive word
   destinations starting at `B + 16`, write `C(0x090)`, `C(0x094)`,
   and the previously read `C(0x098)`.
3. Read `C(0x09C)` and `C(0x0A0)`. At consecutive word destinations
   starting at `B + 28`, write `C(0x090)`, `C(0x09C)`, `C(0x0A0)`.
4. Read `C(0x0A4)` and `C(0x0A8)`. Write the previously read
   `C(0x0AC)` at `B + 40`; read `C(0x0B4)`; then write
   `C(0x0A4)` and `C(0x0A8)` at `B + 44` and `B + 48`.
5. Obtain `B + 40` through the relocated pointer at `0x0B0`.
   Write `C(0x0B4)` at `B + 60`, then `C(0x090)` and `C(0x0A4)`
   at `B + 52` and `B + 56`.
6. Read `C(0x0B8)`. At consecutive word destinations starting at `B + 64`,
   write `C(0x0B8)`, `C(0x0A4)`, `C(0x0A8)`, then return.

Every word of the 76-byte BSS is written exactly once. The unusual write of
offset 60 before offsets 52 and 56 is observed, not reordered. There are no
branches except return, calls, stack accesses, integer input dependencies, or
reads of prior BSS contents. At return, the first two integer working positions
contain `B + 64` and `B + 52`; the four floating working positions retain
`C(0x0B8)`, `C(0x0A4)`, `C(0x0A8)`, `C(0x0B4)`, respectively. These are
observable residue, not evidence of a source-level return type.

The array at `[0x168, 0x16C)` contains one relocated pointer to F1. F2 exposes
the array bounds but does not invoke the initializer itself.

## F2: exported module dispatcher

Entry `0x0BC`. Let `p` be the first integer argument, `selector` the second,
and `G` the single writable word in `.data`. The selector comparison is
**unsigned**. The prefix obtains `&G`, compares against five, preserves one
callee-saved working register plus return state in an eight-byte stack frame,
and transfers to a case through the relocated five-entry table when in range.
There are no calls. All exits restore the saved state.

| Selector | Internal destination | Memory behavior | Return value |
| --- | --- | --- | --- |
| 0 | `0x0E4` | Store a zero word at `p`; the source is scalar slot `0x148` | Zero |
| 1 | `0x0EC` | Store the first argument itself into `G` | Zero |
| 2 | `0x0F4` | Read `G`, then store that word at `p` | Zero |
| 3 | `0x100` | Store the initializer-array begin at `p`, then its end at `p + 4` | Zero |
| 4 | `0x110` | Store the empty `.rodata` begin at `p`, then the same address at `p + 4` | Zero |
| All other unsigned values | `0x128` | No output or global writes | Opaque fixed value from scalar slot `0x164`; high bit set |

The initializer bounds are `.text + 0x168` and `.text + 0x16C`; the end is
one-past `.text`. The empty range returned by selector 4 has both bounds equal
to `.rodata + 0`. The selector 0/2 paths share a word-store continuation at
`0x0F8`. The selector 3/4 paths share their second store at `0x11C`.
Successful cases converge at `0x120`. The default path ends at `0x140`.

The default path reads the scalar at `0x15C`, then the scalar at `0x160`,
then the final result at `0x164`; only the last survives in the return position.
Three side-effect-free instruction positions remain at `0x12C`, `0x134`,
and `0x138`. No additional callable body starts at these internal labels.
The first argument is not dereferenced by selector 1 or the default path.
Other cases do not validate their output pointer. Before initialization,
selector 2 reads the zero-initialized `G`; F1 does not modify `G`.

## Segments, state, exports, and relocation contract

| Segment | Index | Bytes | Initialization and alignment facts |
| --- | ---: | ---: | --- |
| `.text` | 0 | 364 | Code/pools as classified above; all code and word slots four-byte aligned |
| `.rodata` | 1 | 0 | Honest empty range; two pointer references to its base |
| `.data` | 2 | 4 | One initially zero writable word, `G` |
| `.bss` | 3 | 76 | Loader-zeroed storage; subsequently nineteen F1 word writes |
| Reserved segment slots | 4, 5 | 0 each | No additional payload |

The structural ELF converter assigns alignment four to all four main segments.
No stronger original runtime alignment is established here. The CRO header
declares **108 bytes** of BSS allocation, whereas the actual BSS segment is
**76 bytes**. The remaining **32 bytes** have no segment payload, symbol,
relocation, or code reference in this module. Their loader allocation purpose
is unresolved; do not invent additional initialized state or matching credit.

There are two named exports, abstractly identified by their table positions:
export 0 targets F2 at `0x0BC`, and export 1 targets F0 at `0x000`. There are no
indexed exports, named/indexed/anonymous imports, imported modules, external
dependencies, import patches, or auxiliary relocation-table entries. The CRO
header's primary code-entry field resolves to F2. Its other three special
entry fields are absent. Original export link strings are intentionally
withheld under the task's string-content restriction.

All **13 relocations** write four-byte words in `.text`, are CRO type 2,
and convert to `R_ARM_ABS32` against local section symbols. There are no
relocations in `.data`, `.rodata`, or `.bss`, and no relocation output overlaps
executable instructions. The addends below are the converter's ELF REL
addends; all are positive or zero, with no Thumb low-bit tagging. Original
unresolved CRO output slots are zero; conversion places these addends in them.

| Output text offset | Target section | Addend | Neutral role |
| --- | --- | ---: | --- |
| `0x08C` | `.bss` | `0x000` | Initializer state base |
| `0x0B0` | `.bss` | `0x028` | Initializer second state address |
| `0x0D0` | `.text` | `0x0E4` | Selector 0 destination |
| `0x0D4` | `.text` | `0x0EC` | Selector 1 destination |
| `0x0D8` | `.text` | `0x0F4` | Selector 2 destination |
| `0x0DC` | `.text` | `0x100` | Selector 3 destination |
| `0x0E0` | `.text` | `0x110` | Selector 4 destination |
| `0x144` | `.data` | `0x000` | Dispatcher global address |
| `0x14C` | `.text` | `0x168` | Initializer-array begin |
| `0x150` | `.text` | `0x16C` | Initializer-array end, one-past segment |
| `0x154` | `.rodata` | `0x000` | Empty-range begin |
| `0x158` | `.rodata` | `0x000` | Empty-range end |
| `0x168` | `.text` | `0x008` | Single initializer-array element |

The pools consist of 52 relocated-pointer bytes and 64 scalar bytes: twelve
binary32 slots in F1's pool and four scalar words in F2's final pool. No literal
strings occur in these runtime segments. String-bearing export metadata is
separate from the segments and remains private.

## Container accounting outside runtime segments

This accounts for container storage without treating it as additional code or
data requiring source reconstruction:

| File interval | Bytes | Classification |
| --- | ---: | --- |
| `[0x0000, 0x0138)` | 312 | CRO header and four coverage hashes |
| `[0x0138, 0x0180)` | 72 | Zero alignment fill |
| `[0x0180, 0x02EC)` | 364 | Runtime text segment |
| `[0x02EC, 0x1000)` | 3,348 | Zero fill in hashed code region |
| `[0x1000, 0x114C)` | 332 | Module/link metadata |
| `[0x114C, 0x1150)` | 4 | Initialized writable word |
| `[0x1150, 0x2000)` | 3,760 | Uniform nonzero trailing fill; no declared segment or table owns it |

The 332 metadata bytes comprise an 11-byte module identity, one zero alignment
byte, six 12-byte segment entries, two 8-byte named-export entries, two 8-byte
export-tree entries, a 60-byte export-string region, and thirteen 12-byte
internal relocation entries. Other declared tables have zero entries. The
trailing fill's value is withheld; its SHA-256 is
`8be44f71c22812ea605a4933c112043312f4ce5162a2b6c341be2d7318c741b3`.
It is not an unexplained executable or asset section.

## Inventory assessment and exact completion blockers

The public inventory is **incomplete, but its sole accepted function is
correct**. Its partition exactly covers 364 bytes without overlap:
8 function bytes, 116 ARM gap bytes, 68 pool bytes, and 172 unknown bytes.
The unknown intervals are `[0x008, 0x08C)`, `[0x090, 0x0B0)`, and
`[0x0B4, 0x0BC)`. They contain F1's 124 code bytes and 48 scalar-pool bytes.
The existing ARM gaps are exactly F2's two code intervals; they are not stray
code or separate functions. Existing pool classifications are consistent with
this analysis. Thus no accepted range is disproved; the conservative labels
underclassify demonstrably address-taken code and literal data.

A complete runtime accounting would contain 248 code bytes and 196 data bytes
(116 text-pool bytes + 4 initialized bytes + 76 zero-fill bytes), totaling 444.
The current report's `.text` section aggregate of 124 includes 116 gap bytes,
but its accepted-function code denominator is only eight. Its data denominator
of 148 omits the 48 newly classified scalar bytes. Neither the 100% accepted
function match nor this specification warrants completed-unit credit.

Full implementation from this document alone is **not feasible under the
current disclosure and representation constraints**:

1. F1's twelve exact scalar values and the default-path scalar contents are
   target literal/table contents, which this task explicitly forbids
   publishing. Symbolic dependencies and pool hashes permit private
   verification, but do not supply those values to a target-blind implementer.
   The memory layout and operation schedule are fully characterized; the
   exact initialization values and default status remain opaque.
2. Runtime export names occupy the private 60-byte string region. Their
   target spellings cannot be supplied here. Reproducing the CRO's original
   exported-name interface requires an independently authorized neutral naming
   source or a private verifier/alias mapping outside the implementation brief.
3. The current public function schema/exporter requires a single contiguous,
   instruction-only body per function. F2 has an interior relocated dispatch
   table. A 136-byte contiguous claim would incorrectly own 20 data bytes;
   promoting its case block to a separate function would invent a boundary.
   F1 also lacks the direct-call/external-entry evidence required by the
   exporter's current `hasCallEvidence` rule, despite the initializer-array
   reference. Reviewed inventory/report support for these facts is required;
   this analysis does not change those gates.
4. The unexplained 32-byte header allocation surplus and uniform container
   fill have been bounded explicitly. They do not block the runtime-segment
   accounting, but their original loader/packaging convention has not been
   independently reconstructed. Exact original container reproduction would
   need that additional evidence as well as the withheld strings/literals.

## Verification evidence and reproducibility anchors

Private abstract evaluation confirmed all 19 F1 destination words, their exact
write order, single coverage of BSS, and its final state-address residue. F2
was evaluated for selectors 0 through 4, 5, the unsigned high-bit boundary, and
the maximum unsigned word: effects were respectively one, one, one, two, two,
zero, zero, and zero word writes. Valid cases returned zero; invalid cases
returned the final opaque scalar. Code tiling covered all 248 executable bytes
as 62 four-byte ARM instructions. No runtime/gameplay test is claimed.

Text-region SHA-256 identities below use the **structural ELF REL form**, with
the documented addends present in relocation slots. They are verification
identities, not replacements for withheld data:

| Interval | SHA-256 |
| --- | --- |
| `[0x000, 0x008)` | `e589c5df8f2165646b76d51210e582481e4ce9fcf143a96f4c61de56bf2e5e12` |
| `[0x008, 0x084)` | `ffffd00a76bb2cd2b538693db803071e623261092f5b4d7518c43c487a74038d` |
| `[0x084, 0x0BC)` | `d19e36f2abb9ddb5b811cca944dd9f6a9ea5f56b5db32c337998d97d2bd07590` |
| `[0x0BC, 0x0D0)` | `d354f6231d0117c94d6cadc81c07f710cf32306924ea71c539770f09139be214` |
| `[0x0D0, 0x0E4)` | `ecab24747cfd40b229c9f89609f05751b16852b48a4063c2876e02706b69ac3f` |
| `[0x0E4, 0x144)` | `2600e3f459095f9ca4fc0a30731fac70633c04fa0a2877cacb92bda899ea41e6` |
| `[0x144, 0x16C)` | `5bd18c23b0a7096f7575829922313ea1d82a7601071dcb4072a744eb7277dad1` |

The complete raw CRO text-segment SHA-256 is
`54ea6aaa53dd88adb0c23f8afd96c68dd40966416c3616121564f8a55e4af92c`;
the complete REL-normalized text SHA-256 is
`1723f9e17853de40d8d96b32ce6f2e8a99706117f9dbfc91c810ccadcad59ed3`.
The difference is solely relocation-slot addend materialization.

Public-input identities at the observed baseline:

- Report: `49bc791d3ad674f5f572ceeab7e49823b373c7c22a59c690efd8076c98972410`.
- DllTestPGL CSV: `1ef449e4096be0777dc86716e59d2a9a2ae13184a1ff45f45562544553fac476`.
- DllTestPGL partition: `ff614e1bf8dd0ccce0520105eb6abf8953ec24c72c0b8097c8937823b57e0254`.
- CRO converter: `bf55f7832d091db5b328c9bc1876fed88d3246ad61690d803a60276509190012`.
- CRO splitter: `8adcd5fa9f1c0a66d3ce8abf382f501329f8bd9edd9ff0794cd6936e0c56fc1b`.
- Function exporter: `5955a3289fbab12a20329fdd6c076159eafcf6fedde1667fb30f005842002b57`.
- Partition exporter: `29e22be27e608d5ff8c4061ebbb3863c5fe5ce9384424e9472b9ce2c2b7c17e8`.

Final documentation checks passed: `npm run check:clean`, whitespace checking,
relative-link resolution, digest-length and partition arithmetic checks, and a
private comparison confirming that neither original export names nor private
input locations appear in this document. The only workspace change is this
specification; no commit was created.
