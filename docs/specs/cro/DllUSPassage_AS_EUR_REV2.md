# DllUSPassage: AS_EUR_REV2 analysis and implementation contract

Status: **analysis handoff; review required; full linking blocked**. Scope is only
`cro/DllUSPassage`. This document supplies neutral behavior and interface facts
for a separate implementer. It does not approve existing implementation provenance,
claim a complete reconstruction, or authorize widening the public inventory.

## Evidence and provenance

Observed on 2026-10-17 against repository revision
`4a07fbcd399281cd0006d8cf3c439e6bc50ec2bb`, following
[the clean-room protocol](../../CLEAN_ROOM.md). This contribution is ANALYSIS,
not implementation. No implementation source was edited. The analyst inspected
private target instructions and relocation metadata; the implementer should use
this document and reviewed public metadata without inspecting those instructions.

Evidence identifiers used below:

- **P1**: [public unit inventory](../../../progress/units/AS_EUR_REV2.cro.json),
  [function CSV](../../../symbols/cro/DllUSPassage.csv), and
  [complete text partition](../../../symbols/cro-partitions/DllUSPassage.json).
- **P2**: [authoritative report snapshot](../../../progress/reports/AS_EUR_REV2/report.json),
  identical by SHA-256 to the root checkout's current local report when inspected.
  Report digest: `49bc791d3ad674f5f572ceeab7e49823b373c7c22a59c690efd8076c98972410`.
- **P3**: [source ownership configuration](../../../config/cro-sources.json),
  [contract 10](contract_10.md), and
  [contract validator](../../../scripts/validate-cro-contract-10.mjs).
- **T1**: privately owned module located through the root checkout's ignored
  local environment configuration. Size 20,480 bytes; SHA-256
  `64376f24f024c96cbe249746bc089d47b999cd6367918829912df7d582b1fdc0`.
  Identity agrees with P1. No private location or target payload is included here.
- **T2**: in-memory conversion of T1 using
  [the CRO converter](../../../scripts/generate-cro-target-object.mjs), which
  verifies all four embedded hash regions. Its output exactly reproduced the
  current structural ELF: 17,268 bytes, SHA-256
  `deafebc238f25dc7fe2722db38c2c9794de8d5edafd8ed7d4ac5ff8f8dfe306e`.
- **T3**: static decoding of T2 with GNU Arm Binutils 2.44, explicitly selecting
  ARMv6K, plus inspection of segment and relocation records using Node.js
  v24.21.0 and repository parsers. Behavioral statements below are static
  observations; no on-console execution or imported-service implementation was
  observed. Descriptive names such as “allocate” are hypotheses based on call
  usage; numeric identity and arguments are the contract.
- **T4**: private original inventory log records Ghidra 11.3.2,
  `ExportCroFunctions.java` and `ExportCroPartition.java`: two accepted bodies,
  72 rejected ambiguous bodies, 76 gaps, 76 pools, four unknown ranges.
  This work did not rerun or replace that analysis.

The available objdiff CLI identifies itself as 3.8.2. A fresh in-memory split
using [the splitter](../../../scripts/split-cro-target-object.mjs) has identical
logical symbols and identical named section payloads except symbol/string-table
serialization, compared with the current report target. Section order differs.
Thus the existing split ELF's whole-file digest
`1971a61aebf8c76c97efce8657884ef305c5dfcf1d295e80cae47e5dfdf11a4b`
is not a reproducible fresh-split digest. Fresh output is 39,912 bytes, digest
`47aa0a0d89311518d8985ccbda7375085c88103faf0c7d822a51c95a8f305704`.
This is an observed artifact distinction, not evidence of different game code.
No report, target artifact, or inventory was replaced to resolve it.

## Current ownership and accounting

P1 and P2 accept exactly these two global ARM functions. Addresses hereafter are
**original segment-relative hexadecimal offsets**, and ranges are half-open.
The report's synthetic addresses `7992` and `8808` are comparison-layout
addresses, not the original offsets or load addresses.

| Accepted identity | Original text interval | Bytes | Current authorship/credit |
| --- | --- | ---: | --- |
| `func_000013BC` | `[0x13BC,0x16EC)` | 816 | Unclaimed; no match credit |
| `func_000019F4` | `[0x19F4,0x1BDC)` | 488 | Contract 10; 100% function score |

P2 reports 1/2 matched functions, 488/1,304 matched code bytes, 37.423313%
matched code, 2,040 data bytes, and `complete:false`. Both accepted functions
together cover only 1,304 of the original 9,972 text bytes. The section summary
counts 9,296 executable bytes, including 7,992 gap bytes; its 160 unknown bytes
are separate. Matching both accepted functions must not imply full module linking.

## Common ABI and dependency vocabulary

Both entries receive a writable object pointer `S` in `r0`; its context pointer
is the 32-bit word at `S+0x08`. Pointers and words are 32 bits, little-endian.
These entries execute in ARM state, with 4-byte instruction alignment and
interworking indirect calls. Virtual slot numbers below are **byte offsets from
the vtable pointer stored in the receiving object's first word**. Every virtual
call supplies that receiving object as its first integer argument.

Neither observed caller uses the return value. Treat both routines as operations
with no specified semantic return value; do not infer a success boolean from
the last imported result. Preserve the platform's nonvolatile integer registers,
stack and interworking return behavior. `func_000013BC` also saves/restores `d8`
and uses single-precision VFP arithmetic and `s0` arguments. Its total observed
stack decrement is 208 bytes, including saved registers; the other entry uses
104 bytes. Both maintain 8-byte stack alignment at calls.

Notation: `W(P,k)` reads a 32-bit word at byte offset `k`, `B(P,k)` a byte;
`&S[k]` denotes an address inside the object. Integer arithmetic wraps at 32 bits
where subtraction or increment is described. `C=W(S,0x08)`,
`L=W(W(W(C,0x60),0x1C),0x14)`.

`Ixxx` means the imported service reached through the local text veneer at
hexadecimal offset `xxx`. Each veneer tail-transfers through a separate ABS32
pointer word. The full linkage identity is specified later. The following are
the call-facing meanings needed for the accepted functions; names are neutral
descriptions, not recovered original symbols.

| Import | Argument/result behavior required by these callers |
| --- | --- |
| `I024` | `(C) -> context-service object`; caller reads word `+0x34` from result |
| `I0BC` | `(byte_count, allocator_context) -> nullable storage` |
| `I0FC` | `(storage,0,0,0,1,0) -> constructed object` |
| `I104` | `(object,C24,resource,vector_pointer,0,mode) -> status` |
| `I10C` | `(0,0,0)` after an unsuccessful shared `I104`; termination unknown |
| `I114` | `(storage) -> constructed object` |
| `I11C` | `(shared_object,2,0,other_shared_object)` |
| `I124` | `(L) -> unsigned element count` |
| `I12C` | `(L,unsigned_index) -> element` |
| `I134` | `(element,2) -> exclusion value`; nonzero excludes the element |
| `I13C` | `(storage) -> constructed virtual object` |
| `I144` | `(resource,&position)`; caller consumes three output floats |
| `I14C` | `(object,&position)` |
| `I154` | `(manager,object,0,0)` |
| `I15C` | `(W(C,0x60)) -> request/service handle H` |
| `I174` | `(H,0x68) -> existing-state test` |
| `I17C` | `(H,W(C,0x04),0x68,0)` |
| `I184` | `(element,8) -> numeric selector` |
| `I18C` | `(H,&request_descriptor)`; return value unused |

No null checks protect `S`, `C`, `L`, provider objects, or virtual receivers.
Allocation is tested before construction, but a null allocation is still stored
and used by subsequent operations. Preserve this call ordering; do not invent
successful allocation, early returns, or exception recovery.

The apparent six-element arrays have these bases: objects `0x2C`, wrappers
`0x44`, request outputs `0x5C`, second outputs `0x74`, selectors `0x8C`.
Their spacing supports capacity six, but **neither accepted routine bounds the
number of included elements to six**. A usable caller must ensure capacity;
do not silently clamp or reinterpret the raw object layout. Other relevant
fields are resource `0x24`, flag byte `0x28`, shared wrapper `0xAC`, shared
object `0xB0`, and shared output words `0xB4`, `0xB8`. The object must extend
through at least `0xBC` for the observed writes.

## `func_000019F4`: submit requests and initialize output slots

Evidence: T3; direct entry call at text `0x1C9C` in the unaccepted state-machine
region. Its caller first obtains the list count into `S+0x18`, counts included
elements into `S+0x1C`, and later advances a state byte at `S+0x14`.

Required operation sequence:

1. Cache `C`, `L`, allocator `W(C,0x04)`, and provider `P=W(C,0x10)`.
   Clear **one byte** at `S+0x28`. Obtain `H=I15C(W(C,0x60))`.
2. If `I174(H,0x68)` returns zero, set `B(S,0x28)=1` and invoke
   `I17C(H,allocator,0x68,0)`. Otherwise leave the byte zero.
3. Clear exactly six words at `S+0x5C` through `S+0x70`. Do not also clear
   the parallel array at `0x74` or the shared outputs at `0xB4`/`0xB8`.
4. Iterate original indices starting at zero while index is unsigned-less-than
   `W(S,0x18)`. The count is reloaded at each loop end. Obtain an element through
   `I12C(L,index)`. Skip it when `I134(element,2)` is nonzero. Maintain a separate
   packed index `j`, incremented only for included elements.
5. For an included element, store `I184(element,8)-1` at `S+0x8C+4*j`.
   Zero therefore wraps to `0xFFFFFFFF`; there is no selector validity test.
   Build a descriptor as specified below, obtaining the two provider values
   by **two separate** virtual calls to `P` slot `0x34`. Submit with `I18C`.
6. After the loop, always submit one more descriptor, including for count zero
   or when all elements were excluded. Its selector is 26; its output pointers
   are `&S[0xB4]` and `&S[0xB8]`. It also makes two distinct provider calls.

The descriptor is a 40-byte record. Offsets not listed are unspecified padding;
the routine initializes only the stated bytes/words and may reuse stack storage.
Do not treat unspecified padding as target-defined zero data.

| Descriptor offset | Width | Included element | Final shared request |
| --- | ---: | --- | --- |
| `0x00` | byte | 16 | 16 |
| `0x04` | word | `0x68` | `0x68` |
| `0x08` | word | `W(S,0x8C+4*j)` | 26 |
| `0x0C` | byte | 1 at submission | 1 at submission |
| `0x10` | word | first `P.slot34()` result | first result |
| `0x14` | word | 0 | 0 |
| `0x18` | word | second `P.slot34()` result | second result |
| `0x1C` | word | `0x80` | `0x80` |
| `0x20` | word | `&S[0x5C+4*j]` | `&S[0xB4]` |
| `0x24` | word | `&S[0x74+4*j]` | `&S[0xB8]` |

The descriptor is caller-local storage. Its consumption/copy/lifetime behavior
inside `I18C` is not established; the implementation must make the submission
before reusing the descriptor and must not manufacture asynchronous ownership.

## `func_000013BC`: construct and place included objects

Evidence: T3. The unaccepted setup region beginning `0x18A0` tail-calls this
entry at text `0x19EC`, after obtaining `S+0x24` and other resources.

1. Cache `C24=W(C,0x24)`, `C2C=W(C,0x2C)`, allocator `W(C,0x04)`.
   A three-word initial vector `A` has each word set to `0x02010000`.
2. Allocate 64 bytes with `I0BC`. For nonnull storage call
   `I0FC(storage,0,0,0,1,0)`. Store the result/null at `S+0xAC`.
   Call `I104(W(S,0xAC),C24,W(S,0xB4),&A,0,0)`.
   If its result is zero, call `I10C(0,0,0)`; if that service returns, continue.
3. Allocate 36 bytes, conditionally construct with `I114`, and store the
   result/null at `S+0xB0`. Call `I11C(W(S,0xAC),2,0,W(S,0xB0))`.
4. Obtain a count once through `I124(L)`. Iterate its unsigned range, applying
   the same `I12C` and exclusion predicate `I134(element,2)`. Maintain packed
   index `j` separately from the original list index. This routine uses this
   fresh count, not `W(S,0x18)`.
5. For each included element, initialize a new three-word vector `D`, all words
   `0x02010000`. Allocate/conditionally construct another 64-byte wrapper via
   `I0BC`/`I0FC`; store it at `S+0x44+4*j`. Call
   `I104(wrapper,C24,W(S,0x5C+4*j),&D,0,1)`; its result is ignored.
6. Construct a local 44-byte option block `Q`. Its first byte is zero. Words
   at offsets `0x04,0x08,0x10,0x14,0x18,0x20,0x24` are zero; word `0x0C`
   is 4; words `0x1C` and `0x28` are 1. Padding bytes `0x01..0x03` are not
   initialized by the routine.
7. Allocate 200 bytes; conditionally call `I13C`; store result/null at
   `S+0x2C+4*j`. Let this object be `O`. Make these virtual calls in order:
   `O.slot2C(C24,C2C,wrapper,0,&Q)`, `O.slot1C(0)`,
   `O.slot34(C24,W(S,0xB0),0,0,0xFFFFFFFF,0)`,
   `O.slot38(0)` with VFP `s0=+0.0f`, and
   `O.slot40(0)` with VFP `s0=+0.0f` again. Integer arguments after the
   receiving object follow the register/stack order shown. These virtual
   signatures must preserve the VFP channel; an integer-only prototype loses it.
8. Read `name[j]` from the six-pointer name array rooted at `.data+0x10`.
   Ask resource `R=W(S,0x24)` through `R.slot5C(name[j])` for a signed index.
   If the result is nonnegative, call `I144(R,&position)` and
   `R.slot64(index,&matrix)`. The matrix output occupies 48 bytes. Add its
   single-precision translation components at byte offsets `0x0C,0x1C,0x2C`
   to the three position components, with three single-precision additions.
9. Call `I14C(O,&position)` even for a negative lookup index. Obtain
   `manager=W(I024(C),0x34)` and call `I154(manager,O,0,0)`. Advance packed
   index `j` and continue scanning the original list.

Position scratch has a noteworthy initialization limit: it overlaps `A` starting
at `A+4`, so its first two words initially contain `0x02010000`; its third word
has no observed initialization before a successful `I144`. There is no reset
between iterations. A negative first lookup therefore exposes an unspecified
third word, and a later negative lookup reuses prior position state. Do not
invent a zero vector, identity transform, or “skip placement” fallback. The
valid-data path with nonnegative lookup indices is implementable; guarantees
about the negative-index path require an input/service contract. This is static
evidence of incomplete initialization, not proof of a runtime failure.

The accepted body ends before its adjacent 12-byte pool. That pool supplies
the vector initialization scalar, `+0.0f`, and a relocation to `.data+0x10`;
it is separate ownership and cannot be silently appended to the function claim.
The initial context values are cached, but the list acquisition reloads `S+0x08`;
each registration also reloads `S+0x08`. Resource accesses reload `S+0x24`
between virtual/import calls. Preserve those observations if mocked dependencies
are allowed to change object fields during callbacks.

## Link inventory and section constraints

T1/T2 contain four nonempty segments; the two auxiliary segment slots are empty.
The structural ELF uses alignment 4 for each allocated segment. Segment flags
are executable/read-only text, read-only rodata, and writable data/BSS.

| Segment | Size | Required treatment |
| --- | ---: | --- |
| `.text` | `0x26F4` / 9,972 | Preserve original order, intra-segment offsets, ARM branches, literal reach and table destinations |
| `.rodata` | `0x057C` / 1,404 | 86 relocation outputs plus nonpointer contents; no authored ownership yet |
| `.data` | `0x002C` / 44 | Ten pointer words and one mutable zero-initialized word |
| `.bss` | `0x004C` / 76 | NOBITS; starts zero, then module initializer changes values |

The CRO header requests 108 BSS bytes, 32 more than the explicit segment.
Preserve this distinction in any future loader/container reconstruction; do not
claim an extra 32 matching data bytes. The current comparison unit describes
segments and relocations, not a fully reconstructed 20,480-byte CRO container.
Hashed container padding and metadata must not be imported as source payload.

P1's partition is the exact exhaustive range inventory. Its totals are:
two functions/1,304 bytes, 76 gaps/7,992 bytes, 76 pools/516 bytes, four unknown
ranges/160 bytes. There are no unclassified holes or overlaps.

The first gap `[0,8)` contains an initial no-op and the first veneer; subsequent
53 veneer instruction gaps begin at `0x0C+8*k`, `k=0..52`, each four bytes.
Their 54 adjacent pointer pools begin at `0x08+8*k`, `k=0..53`, each four bytes.
These are unaccepted code/data, not 54 extra credited functions.

All remaining gap intervals, whose boundaries **do not establish function
boundaries**, are:

```text
01C0..0240  0250..0464  0474..0674  067C..069C  06C8..0A48
0A70..0B44  0B48..0F34  0F40..11DC  11E4..1260  1264..1398
13B4..13BC  16F8..19F0  1BDC..1D6C  1D70..1DE4  1DEC..1E50
1E54..2270  2280..23C0  23C8..24BC  24C0..253C  2544..25B8
2644..2658  266C..26CC
```

The other 22 pool intervals are:

```text
0464..0474  0674..067C  069C..06C8  0A48..0A70  0B44..0B48
0F34..0F40  11DC..11E4  1260..1264  1398..13B4  16EC..16F8
19F0..19F4  1D6C..1D70  1DE4..1DEC  1E50..1E54  2270..2280
23C0..23C8  24BC..24C0  253C..2544  25B8..25BC  2628..262C
2658..266C  26CC..26F4
```

All four unknown intervals need explicit resolution before full linking:

- `[0x01B4,0x01C0)`, 12 bytes: observed accessor-like operation reads word
  `arg1+0x1A0` and stores it at `arg0+0x18`, then returns.
- `[0x0240,0x0250)`, 16 bytes: stores `arg1` at `arg0+0x18`, then stores
  `W(arg1,0x1A0)` at `arg0+0x20`, then returns.
- `[0x25BC,0x2628)`, 108 bytes: initializer-like code through `0x2620`, followed
  by two float literals. A relocated startup pointer at text `0x26F0` targets
  `0x25BC`. The initializer writes BSS float state: `(0.7f,0.7f,1.0f,1.0f)`
  at offset zero, four repeated three-float vectors `(297.0f,2.0f,567.0f)`
  starting at `0x10`, and `(-55.0f,-20.0f,-100.0f)` at `0x40`.
- `[0x262C,0x2644)`, 24 bytes: six float constants read by that initializer.

These observations refine the research backlog; they do not promote any
unknown interval into an accepted function or permit replacing it with zeros.

The only structural named export is `nnroControlObject_` at text `0x2644`.
Its accepted-size metadata is absent; its implementation spans gap/pool ranges.
Static interface facts: integer operation selector in `r1`, argument/output
pointer in `r0`; operations 0..4 return zero. Operation 0 writes a null word;
1 saves the argument pointer in `.data+0x28`; 2 writes that saved pointer to
the argument's first word; 3 writes start/end pointers `text+0x26F0` and
`text+0x26F4` to its two output words; 4 writes the same one-past-rodata pointer
`rodata+0x57C` to both output words. Other selectors return status
`0xD8E12C21`. A five-entry relocated dispatch table occupies `0x2658..0x266C`.
Do not mistake the export's 20-byte leading gap for the entire exported routine.

### Relocation obligations

There are **187 R_ARM_ABS32 outputs**: 64 import patches and 123 internal
references. There are 57 unique anonymous imports across two providers, with
no named or indexed imports and no indexed exports. Every text relocation is
in a public pool, with none inside either accepted function or any unknown range.
Record identity, addend, and output location are all part of matching.
Future verification must compare each record's original output offset, target
segment/import identity and wrapping 32-bit addend with the private verifier;
matching the totals alone is insufficient. A split object must rebase these
records to their owning ranges without changing the logical targets. In that
representation function/gap sections use `.text.<identity>`, pool sections use
`.pool.__cro_pool_<8-digit-lowercase-offset>`, and unresolved intervals use
`.cro.unknown.<8-digit-lowercase-offset>`. The splitter gives code alignment 4
for this ARM-only inventory and pool alignment 1; the original segment-relative
placement still governs branch and literal addresses in a full link.

| Output segment | Import outputs | Internal outputs | Internal destination counts |
| --- | ---: | ---: | --- |
| text | 54 | 37 | text 19; rodata 12; data 3; BSS 3 |
| rodata | 10 | 76 | text 58; rodata 18 |
| data | 0 | 10 | rodata 10 |

For all 54 veneers, the imported address is segment 0 of provider `|static|`,
except the three entries explicitly labelled `DllField` below. Each pointer
output is `veneer+4`, with zero addend. These are interface binding facts, not
copied code. Repository ELF naming encodes the provider as lowercase UTF-8 hex:
`__cro_import_anon_m<provider-hex>_s0_<7-digit-offset>`; preserve this identity
when a dependency is still undefined in the relocatable comparison object.

| Veneer | Provider segment offset | Veneer | Provider segment offset | Veneer | Provider segment offset |
| --- | --- | --- | --- | --- | --- |
| `004` | `00E8294` | `00C` | `01FF8C0` | `014` | `034FA84` |
| `01C` | `03ED780` | `024` | `DllField:00E5B70` | `02C` | `03CB850` |
| `034` | `03CB970` | `03C` | `02964E8` | `044` | `03CB79C` |
| `04C` | `0096038` | `054` | `DllField:00E5BA0` | `05C` | `0064818` |
| `064` | `001FA90` | `06C` | `0352EE0` | `074` | `03529F8` |
| `07C` | `004E348` | `084` | `DllField:00DA5D0` | `08C` | `03CED28` |
| `094` | `0352328` | `09C` | `028B374` | `0A4` | `028B69C` |
| `0AC` | `0352E04` | `0B4` | `03C9700` | `0BC` | `0023480` |
| `0C4` | `0281B00` | `0CC` | `0352160` | `0D4` | `03C9714` |
| `0DC` | `0281CBC` | `0E4` | `0352E54` | `0EC` | `03525B4` |
| `0F4` | `0352E74` | `0FC` | `029DBEC` | `104` | `029D6E8` |
| `10C` | `004EA64` | `114` | `0295C80` | `11C` | `03CE2D4` |
| `124` | `03D341C` | `12C` | `03D36DC` | `134` | `03D2E20` |
| `13C` | `037BDDC` | `144` | `03CCDD4` | `14C` | `02878F8` |
| `154` | `0291CE8` | `15C` | `000E068` | `164` | `00397B8` |
| `16C` | `000A1F0` | `174` | `0023388` | `17C` | `001C764` |
| `184` | `03D251C` | `18C` | `026D9DC` | `194` | `03C7020` |
| `19C` | `03DC688` | `1A4` | `035BB70` | `1AC` | `035BAF8` |

The remaining three unique imports target `|static|` segment 1. They account for
ten rodata outputs: provider offset `0x45DF8`, addend 0, at `0x2D8,0x2EC`;
offset `0x5A458`, addend 8, at `0x2DC,0x2FC`; offset `0x5A468`, addend 8,
at `0x2D0,0x2E4,0x2F0,0x304,0x310,0x31C`.

Internal text obligations include eleven relocated switch destinations in pool
`0x069C..0x06C8`, five in `0x2658..0x266C`, and three further text targets
at `0x26D4`, `0x26D8`, `0x26F0`. BSS references are at text `0x0A48`,
`0x19F0`, `0x2628`, with addends `0x10`, `0x40`, zero respectively.
Data references are at `0x0A6C`, `0x16F4`, `0x26CC`, with addends zero,
`0x10`, `0x28`. The twelve rodata-reference sites in text are `0x0A68`,
`0x0F38`, `0x0F3C`, `0x1398`, `0x13A0`, `0x13A8`, `0x1DE4`,
`0x1DE8`, `0x253C`, `0x2540`, `0x26DC`, `0x26E0`.

The 76 internal rodata references include callback/vtable targets in unaccepted
code and references to rodata metadata/strings. Their count is inventoried;
their complete semantic ownership and independently authored construction are
**not supplied** by the accepted-function contracts. This is a concrete blocker
for full linking, even if the accepted bodies and the veneer bindings match.

### Data and read-only residue

All 44 data bytes have a known structural role: four rodata pointers at offsets
`0,4,8,0xC`, targeting rodata `0x228,0x240,0x280,0x2A0`; six name pointers
at `0x10..0x24` targeting six consecutive six-byte records at rodata
`0x558+6*j`; and the mutable null word at `0x28`. The latter is written by
the exported control routine. The six five-character names plus terminators are
not reproduced here. Their spelling and lookup meaning need an approved neutral
resource-binding specification before `func_000013BC` can be linked against
real resources. Its behavior can already be implemented against supplied names.

Read-only intervals `[0,0x2D0)`, `[0x2D0,0x328)`, `[0x328,0x440)`,
`[0x440,0x558)`, `[0x558,0x57C)` cover the entire rodata segment. The second
contains relocated metadata; the fourth contains callback/vtable structures;
the last contains the six name records. Eight NUL-terminated printable runs
begin in the third interval, with lengths 22,29,32,33,36,36,37,44, followed by
alignment padding. Their content and the first interval's
nonpointer data have not been given an independently implementable semantic
specification. They must not be copied, zero-filled, or omitted to obtain a
completion claim. No binary strings, asset payloads, or full extracted tables
are included in this handoff.

## Validation and acceptance expectations

The following checks were run during analysis:

- `validateCroFunctionSemantics` on T2, P1 CSV and partition: passed; exactly
  two functions, 1,304 body bytes, 76 pools, 91 text relocations, and two
  independently evidenced entries. This validates inventory structure,
  instruction tiling, terminal instructions, and absence of external direct
  flow into an accepted body's interior; it is not behavioral execution proof.
- T1 conversion and structural-target equality: passed. Fresh split comparison:
  logical symbols and named content agree; whole-file equality does not, as
  described in provenance. No artifacts were published by these in-memory checks.
- `node scripts/validate-cro-contract-10.mjs`: passed public ownership checks.
- `node scripts/validate-public-cro-metadata.mjs`: passed.
- The existing report passed `prepare-bytematch-report` validation without a
  snapshot update; the temporary generated report copy was removed.
- `npm run check:clean`: passed. This is a repository hygiene check, not an
  attestation that unresolved module data has been reconstructed.

For later independent implementation, function objects must be ARM ELF32
little-endian relocatable objects, with exactly the claimed global function
symbol and `.text.func_XXXXXXXX` body section of the exact accepted size. No
target pool, unknown, padding or neighboring bytes may enter a function claim.
The body-only SHA-256 expectations, observed in T2, are:

```text
func_000013BC  29fdcae73468ad66dba3dd60de6b32cae142afbacc16f44f8aa6bb120bc95da1
func_000019F4  70fd8be721ab195ceac4e6d657b31ae3858f7eedb37f0113ba37de4b0ce63665
```

The existing contract-10 object gate requires exactly 488 executable allocated
bytes for its DllUSPassage object, symbol value zero/size 488, the second digest,
zero relocations, and no additional allocated bytes. It currently assumes
one owned source/body in this unit; adding `func_000013BC` needs separately
reviewed validator/config integration. It must not silently relax that gate or
make the eight-unit batch fail. A separate implementation may be staged before
integration, but this analysis changes neither the gate nor ownership.

An isolated body can have a reduced semantic score because its branch/literal
neighbors are unowned. Contract 10 documents 99.508194% for isolated
`func_000019F4`; P2 currently credits 100%. Neither number substitutes for the
exact body digest, relocation ownership, or a whole-unit check.

Recommended meaningful behavioral verification uses mocked imports/virtual
objects to record ordered calls and writes: zero/all-excluded/mixed list cases;
changing `S+0x18` at a callback boundary for the request loop; selector zero
wrapping; both `I174` outcomes; distinct results from the two provider calls;
correct packed output pointers; nonnegative name lookup and matrix translation;
negative lookup state reuse with explicitly seeded scratch; nullable allocation
call ordering. Check object sentinels around six cleared words and unchanged
parallel/shared outputs. These are expectations for future tests, not tests
executed by this analysis.

Genuine full linking additionally requires every gap, pool, unknown range,
rodata/data/BSS construction and all 187 relocation outputs, including target
identities/addends and one-past-section pointers. Preserve virtual callback and
startup entry relationships. Obtain an independent, reviewed specification for
remaining unaccepted routines and read-only records before implementing them.

Current [objdiff configuration generation](../../../scripts/generate-objdiff-config.mjs)
sets completion only when the entire target/base object buffers are identical
and neither contains unknown sections. The
[report validator](../../../scripts/prepare-bytematch-report.mjs) separately
requires published CRO units to remain `complete:false` and matched-data credit
zero under the present policy. Function completion alone must leave this unit
incomplete. Resolving unknown classifications, reproducible ELF serialization,
whole-unit build ownership (the current base builder removes aggregate data
sections), and completion/report policy need separate authorized integration.

## Implementable scope and concrete blockers

**Implementable from this handoff after review:** both accepted functions'
valid-input call/control behavior, object writes, descriptor shape, virtual
calls and VFP channels; wrapper bindings; the two small unknown accessors'
observed operations; control-export operation behavior; BSS initialization
semantics. Acceptance of extra entry boundaries remains a separate analysis task.

**Still blocked for a genuinely linked module:** independently authored semantics
for the 7,992 gap bytes and their callback entry boundaries; resolution of the
four public unknown ranges; semantic construction of all 1,404 rodata bytes,
including resource-name bindings and callback/type records; complete reviewed
internal relocation ownership; imported-service error/lifetime contracts and
negative-lookup input guarantees; a whole-unit data-capable build and validation
path; serialization/completion-policy reconciliation. More compiler tuning or a
second accepted-function match cannot resolve these blockers. No completion or
runtime-equivalence claim is made here.
