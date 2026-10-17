# DllUSGymFire executable-range and duplicate analysis

## Provenance and limits

This is **analysis**, under `docs/CLEAN_ROOM.md`, of `cro/DllUSGymFire` in
`AS_EUR_REV2`, against repository revision
`4a07fbcd399281cd0006d8cf3c439e6bc50ec2bb`. Observations were made on
2026-10-17. The verification input was located through the root checkout's
ignored `.env.local`; no private location is part of this specification.
No leaked source, proprietary headers, or SDK material was consulted.

Tools: the repository's `parseCro` from
`scripts/generate-cro-target-object.mjs`, Node.js v24.21.0, and GNU objdump
2.45.1.20251203 from Arm GNU Toolchain 15.2.Rel1. The parser verified the
container's four hash regions and relocation geometry. Its reconstructed text
was equal to the existing converted verification object's text. ARMv6K decoding,
control flow, literal references, return boundaries, and relocated callback
references were inspected. This is static evidence, without execution testing.

Public comparison inputs were `src/main`, `src/cro`, their specifications,
and the corresponding existing public build objects. An initial comparison
covered 4,253 public function bodies. Candidate screening allowed symbolic
call destinations, literal placement, and scalar parameters to differ;
reported positive matches were then checked against their public source.
Similar purpose alone does not establish a duplicate. “No supported duplicate”
below means no complete structural and behavioral counterpart was established
in this revision; it is not a proof against every possible semantic rewriting.

Only this document is contributed. These proposed boundaries do not modify
accepted symbols, partitions, source ownership, configuration, or validators.

## Coordinates and accounting

All addresses are offsets within this module's text, unless qualified.
Intervals are half-open. `Fhhhh` is an analysis label for an entry at `0xhhhh`,
not an asserted original name. `Lhhhh` labels a non-executable word at that
text offset; `Ahhhh` labels address-taken opaque data. `R`, `D`, and `B` mean
this module's read-only, initialized writable, and zero-initialized segments.
`I00` through `I33` are opaque imported callable identities defined below.
All sizes count executable bytes only.

Every local entry described here is **ARM**, four-byte aligned. There is no
justified local Thumb entry. In particular, `[01B4,01CC)` decodes as a coherent
ARM initializer; a Thumb interpretation does not establish a valid routine.
One external import carries a Thumb state bit, which does not change its
local veneer's ARM mode.

| Classification | Entries | Executable bytes |
| --- | ---: | ---: |
| Newly identified exact public duplicates | 13 | 84 |
| Newly identified parameterized public duplicates | 56 | 240 |
| Existing exact source in this module | 1 | 224 |
| No supported complete public duplicate | 11 | 5,400 |
| **All executable entries** | **81** | **5,948** |
| Non-executable literal/dispatch words | | 468 |
| Opaque address-taken identifier data | | 8 |
| **Whole text segment** | | **6,424** |

Thus newly reusable code is **324 bytes**, and reusable code including the
already owned function is **548 bytes**. These are analysis totals, not changes
to reported matching progress.

The public partition currently accounts for 5,892 executable bytes, 460 pool
bytes, and 72 unknown bytes. The refinements here classify the 24-byte
initializer at `01B4`, and split the 40-byte unknown interval at `183C` into
32 code bytes and 8 literal bytes. The remaining 8 unknown bytes at `0EAC`
are address-taken identifier data, not code. Consequently:

`5,892 + 24 + 32 = 5,948`; `460 + 8 = 468`;
`5,948 + 468 + 8 = 6,424 = 0x1918`.

## Complete proposed entry inventory

“Exact” refers to the owned executable body; dependencies outside that body
remain separate. “Parameterized” requires the stated substitution, rather
than treating different callees or different constants as identical behavior.

| Entry or entries | Executable interval(s) | Bytes | Finding |
| --- | --- | ---: | --- |
| `I00`…`I33` local veneers | `[8n,8n+4)`, `0 <= n < 52` | 52 × 4 | Parameterized linker-veneer family |
| `F01A0` | `[01A0,01B4)` | 20 | Exact three-word clear |
| `F01B4` | `[01B4,01CC)` | 24 | No supported duplicate |
| `F01CC` | `[01CC,0204)`, `[022C,0608)`, `[0614,0690)` | 1,168 | No supported duplicate |
| `F0690` | `[0690,0698)` | 8 | Parameterized constant return, value one |
| `F0698`, `F069C` | Four bytes at each entry | 2 × 4 | Exact immediate returns |
| `F06A0` | `[06A0,06C8)` | 40 | No supported duplicate |
| `F06C8` | `[06C8,0704)`, `[072C,0BB8)`, `[0BD4,0DC8)` | 1,724 | No supported duplicate |
| `func_00000DCC` / `F0DCC` | `[0DCC,0EAC)` | 224 | Existing exact source |
| `F0EC0` | `[0EC0,0EE8)` | 40 | No supported duplicate |
| `F0EEC` | `[0EEC,0EFC)` | 16 | Parameterized call then tail-transfer |
| `F0EFC` | `[0EFC,0F00)` | 4 | Parameterized direct tail-transfer |
| `F0F00`, `F0F04` | Four bytes at each entry | 2 × 4 | Exact immediate returns |
| `F0F08`, `F0F10`, `F0F18` | Eight bytes at each entry | 3 × 8 | Exact zero returns |
| `F0F20` | `[0F20,0F24)` | 4 | Exact immediate return |
| `F0F24` | `[0F24,0F2C)` | 8 | Exact zero return |
| `F0F2C`, `F0F30` | Four bytes at each entry | 2 × 4 | Exact immediate returns |
| `F0F34` | `[0F34,10EC)` | 440 | No supported duplicate |
| `F10EC` | `[10EC,16A8)` | 1,468 | No supported duplicate |
| `F16CC` | `[16CC,1748)` | 124 | No supported duplicate |
| `F1748` | `[1748,1828)` | 224 | No supported duplicate |
| `F1834` | `[1834,1838)` | 4 | Parameterized direct tail-transfer |
| `F1838` | `[1838,183C)` | 4 | Exact immediate return |
| `F183C` | `[183C,185C)` | 32 | No supported duplicate |
| `F1868` | `[1868,187C)`, `[1890,18F0)` | 116 | No supported duplicate |

The veneer array is followed by the return-terminated `F01A0`. The `F01B4`
boundary follows that return and ends at its own return. Its entry has no
established incoming call or relocated callback reference, so this is a
locally justified code-body boundary, with less entry-point evidence than
the callback-backed entries. It stores the incoming context and a derived
word, two additional arguments, and a zero word; it returns an advanced
destination pointer. It is not part of the preceding three-word clear.

`F01CC` and `F06C8` each have a separate frame, ten-way state dispatch,
shared continuation after embedded data, and their own success/failure
returns. Their table targets remain internal blocks, not new functions.
`F06A0` selects these bodies with tail transfers. Likewise, the interior
branches and loop headers in the larger lifecycle routines are not entries.

The return-only entries and lifecycle callbacks have additional evidence
from relocated pointers in `R`. Specifically, read-only offsets `01E8`,
`01EC`, `01F0`, `01F4`, `01F8`, `01FC` refer respectively to `F0EFC`, `F0EEC`,
`F0690`, `F069C`, `F06A0`, `F0698`; offsets `0208`, `020C`, `0210`, `0214`,
`0218`, `021C`, `0220`, `0224`, `0228`, `022C`, `0230`, `0234`, `0238`,
`023C` refer respectively to `F1838`, `F1834`, `F16CC`, `F10EC`, `F0F30`,
`F0F2C`, `F0F00`, `F0F20`, `F0F34`, `F0F18`, `F0F24`, `F0F08`, `F0F10`,
`F0F04`. These are pointer-location facts, not a reproduction of table contents.

`F0DCC` retains its accepted boundary. Its neighboring identifier and floating
operands are outside that ownership. `F183C` is independently established by
the initializer pointer at text offset `1914`; its return precedes two scalar
words at `185C` and `1860`. `F1868` is the container's exported control entry;
its five-way dispatch and following literals end the text segment. The word
at `1914` is a function pointer, not another executable entry.

## Public duplicate mappings

| Local entries | Existing public source and name | Equivalence and required parameters |
| --- | --- | --- |
| 52 import veneers | `src/main/arm_linker_veneers.S`, `ARM_LINKER_VENEER`; representative `func_0019BFD8` | Exact four-byte control-transfer body. Parameterize the adjacent destination identity: use the corresponding import relocation instead of the public family's fixed destination. Preserve its state bit. |
| `F01A0` | `src/main/arm_duplicate_templates_24.S`, `clear_words_0_8`, instantiated as `func_002B81F0` and `func_004F2C0C`; also `src/cro/DllBattle/pod_leaves.S:func_000D3244` | Exact 20-byte body. Clear words at destination offsets 0, 4, 8, with no calls or literals. |
| Eight immediate-return entries listed above | `src/main/immediate_return_stubs.c:func_00258368`, also the other empty functions in that file | Exact four-byte compiled body; no memory access, call, literal, or defined value substitution. |
| `F0F08`, `F0F10`, `F0F18`, `F0F24` | `src/main/simple_value_stubs.c:func_002FF110`, also `func_0030F3A4` | Exact eight-byte zero-return body. |
| `F0690` | Constant-return source pattern in `src/main/simple_value_stubs.c`, e.g. `func_002FF110` or `func_00462AF4` | Same eight-byte structure, with returned scalar parameter set to one. This is a parameterized source pattern, not an existing named macro or an exact zero-return duplicate. |
| `F0EEC` | `src/main/arm_duplicate_templates_77.S`, `DT77_CALL_FORWARD`; e.g. `func_002115A8` | Same 16-byte frame/call/restore/tail structure. Parameters: preparation target `I24`, final target `I25`. The first result is forwarded to the latter. |
| `F0EFC`, `F1834` | `src/main/arm_direct_branch_thunks.S`; representative ARM-target instance `func_00142620` | Same four-byte direct tail-transfer form. Destination parameters are respectively `I24`, `I25`. |
| `F0DCC` | `src/cro/DllUSGymFire/contract_10.S:func_00000DCC`; `docs/specs/cro/contract_10.md` | Existing exact 224-byte function, already owned. This is identity with the module's own public implementation, not a newly discovered cross-function duplicate. |

No claim above substitutes a simpler function merely because it returns the
same result on one path. In particular, the initializer at `183C` is not a
four-word clear, and the teardown at `0F34` is not just its final two calls.
The two large state machines also have different frames, tests, effects,
and call schedules; they are not parameterized copies of one another.

## Import and relocation identities

For import index `n`, the local veneer starts at `8n` and reads its
four-byte slot at `8n+4`. That slot has one absolute import relocation.
All 52 slots are distinct. The following is a neutral relocation-identity
schedule, using target segment coordinates rather than imported strings.
`main` identifies the main executable's code segment; `DllField` is the
existing public module name. All targets use segment zero. These coordinates
are identities, not claims that the destination already has public source.

| Import | Target code coordinate | Import | Target code coordinate |
| --- | --- | --- | --- |
| `I00` | `DllField + 0x08BE50` | `I1A` | `main + 0x383EE4` |
| `I01` | `DllField + 0x0E5BA0` | `I1B` | `main + 0x3DC688` |
| `I02` | `main + 0x2F6BDC` | `I1C` | `DllField + 0x086D78` |
| `I03` | `main + 0x2F71F0` | `I1D` | `main + 0x2F234C` |
| `I04` | `main + 0x02BB5C` | `I1E` | `main + 0x2F2DFC` |
| `I05` | `main + 0x2F6494` | `I1F` | `main + 0x383E14` |
| `I06` | `main + 0x2F87B8` | `I20` | `main + 0x2F4910` |
| `I07` | `main + 0x2F81C0` | `I21` | `DllField + 0x07E01C` |
| `I08` | `main + 0x2F131C` | `I22` | `DllField + 0x088B44` |
| `I09` | `main + 0x34FA84` | `I23` | `main + 0x009434` |
| `I0A` | `main + 0x2716C4` | `I24` | `main + 0x0E8294` |
| `I0B` | `main + 0x270778` | `I25` | `main + 0x1FF8C0` |
| `I0C` | `main + 0x2F1618` | `I26` | `main + 0x352EE0` |
| `I0D` | `main + 0x27128C` | `I27` | `main + 0x3529F8` |
| `I0E` | `main + 0x2F671C` | `I28` | `main + 0x023480` |
| `I0F` | `main + 0x3E3FC8` | `I29` | `main + 0x281CBC` |
| `I10` | `main + 0x3E3D8C` | `I2A` | `main + 0x352160` |
| `I11` | `DllField + 0x0DB150` | `I2B` | `main + 0x281B00` |
| `I12` | `main + 0x3DBDB4` | `I2C` | `main + 0x352484` |
| `I13` | `main + 0x2FAE48` | `I2D` | `main + 0x2964E8` |
| `I14` | `main + 0x2F130C` | `I2E` | `main + 0x28B374` |
| `I15` | `DllField + 0x086C3C` | `I2F` | `main + 0x28B69C` |
| `I16` | `DllField + 0x0E5B70` | `I30` | `main + 0x352E54` |
| `I17` | `main + 0x3EDC4C` | `I31` | `main + 0x3525B4` |
| `I18` | `main + 0x383110` | `I32` | `main + 0x00018C`, Thumb state |
| `I19` | `main + 0x044D28` | `I33` | `main + 0x352E74` |

Calls to `I32` still use its local ARM veneer; the relocated destination
preserves the Thumb state marker. Direct local branches are position-relative
dependencies, not additional container relocations.

Text has 93 absolute relocation sites: 52 import slots and 41 internal sites.
Of the internal sites, 25 belong to dispatch metadata: ten words in
`[0204,022C)`, ten in `[0704,072C)`, and five in `[187C,1890)`. Each dispatch
word refers to an internal block of its owning function. These are not
function-pointer inventories and are not reproduced here.

The other 16 internal sites are:

| Site | Symbolic referent |
| --- | --- |
| `L0EE8` | `R + 0x01E8`, first dispatch identity |
| `L16A8`, `L16AC`, `L16B0`, `L16B4` | `R + 0`, `R + 2`, `R + 5`, `R + 1`, respectively |
| `L16B8` | `R + 0x0040`, coordinate-record source |
| `L1828` | `R + 0x0208`, second dispatch identity |
| `L182C` | `F01A0`, element initialization callback |
| `L1830` | `R + 8`, opaque construction descriptor |
| `L1864` | `B + 0`, writable four-word state |
| `L18F0` | `D + 0`, saved control pointer cell |
| `L18F8`, `L18FC` | Text `+0x1914`, text `+0x1918`: begin/end of one initializer-pointer range |
| `L1900`, `L1904` | Both `R + 0x0240`: equal begin/end of an empty range |
| Text `+0x1914` | `F183C`, the one initialization callback |

This exhausts relocation sites within text. The read-only segment has 30
relocations, of which four are imports; its executable callback references
are used above only as boundary evidence. Data segments themselves are not
part of this executable duplicate claim.

## Literal and non-code schedule

The 468 non-executable bytes comprise 208 import-slot bytes, 100 dispatch-word
bytes, and 160 remaining operand/pointer bytes. All intervals are disjoint:

| Non-code class | Text intervals |
| --- | --- |
| Import slots | `[8n+4,8n+8)`, `0 <= n < 52` |
| Dispatch metadata | `[0204,022C)`, `[0704,072C)`, `[187C,1890)` |
| Other operand and pointer words | `[0608,0614)`, `[0BB8,0BD4)`, `[0DC8,0DCC)`, `[0EB4,0EC0)`, `[0EE8,0EEC)`, `[16A8,16CC)`, `[1828,1834)`, `[185C,1868)`, `[18F0,1918)` |
| Separate opaque identifier data, eight bytes | `[0EAC,0EB4)` |

The identifier is passed by address as `A0EAC`. Its contents are unnecessary
to establish the executable duplicate and are deliberately unspecified.
Literal operands are recorded symbolically, without copying their values.
There are two repeated scalar equality classes: `Z` at `0608`, `0BC0`,
`0EB8`, `16C4`, `18F4`; and `U` at `0610`, `0BBC`, `0EBC`, `16C8`, `1860`.
The remaining non-relocated operand words, at `060C`, `0BB8`, `0BC4`, `0BC8`,
`0BCC`, `0BD0`, `0DC8`, `0EB4`, `16BC`, `16C0`, `185C`, `1908`, `190C`,
`1910`, are distinct opaque scalar identities. Do not collapse distinct
slots just because their contents compare equal; their access schedules differ.

The following schedule gives **function-relative access offset → text operand
slot**. This records dependencies, not instructions or literal contents.

| Owner | Access schedule |
| --- | --- |
| `F01CC` | `0A4,0D8,170,264,3D4,470 → L0608`; `110 → L060C`; `158,24C,408 → L0610` |
| `F06C8` | `100 → L0BB8`; `148,31C → L0BBC`; `160,2F8,420,614 → L0BC0`; `2B0,59C → L0BC4`; `2C8,5B4 → L0BC8`; `2F4 → L0BCC`; `3A4 → L0BD0`; `66C,6B4 → L0DC8` |
| `F0DCC` | `024 → A0EAC` (address formation); `054 → L0EB4`; `074 → L0EBC`; `084 → L0EB8` |
| `F0EC0` | `008 → L0EE8` |
| `F10EC` | `048 → L16A8`; `0A8 → L16AC`; `138 → L16B0`; `1A4 → L16B4`; `2AC → L16B8`; `2B4 → L16BC`; `2B8 → L16C0`; `2BC → L16C4`; `430 → L16C8` |
| `F1748` | `00C → L1828`; `020,030,044,058 → L182C`; `090 → L1830` |
| `F183C` | `000 → L1864`; `004 → L185C`; `008 → L1860` |
| `F1868` | `000 → L18F0`; `028 → L18F4`; `044 → L18F8`; `04C → L18FC`; `054 → L1900`; `05C → L1904`; `06C → L1908`; `074 → L190C`; `080 → L1910` |

The three dispatch selectors additionally read their bounded metadata ranges.
No other entry has an observed PC-relative operand dependency.

## Symbolic call schedules

All offsets in this section are hexadecimal and relative to the owner entry.
Lists identify static call sites, not an unconditional runtime ordering:
branches, tests, and loops determine which sites execute. `?` marks a
conditionally linked call. `Vxx` means an indirect call through the receiver's
dispatch table at byte displacement `0xxx`; receiver selection is part of the
behavioral description, not an inferred class name. Interior conditional
branches and loop backs are not calls.

| Owner | Direct linked-call sites, grouped by destination |
| --- | --- |
| `F01CC` | `I00:010; I01:020; I02:068; I03:07C; I04:090; I05:09C; I06:0B0,0E4,480; I07:0C4,494; I08:0FC,108,2AC,2B8; I09:11C; F0DCC:1A8,2DC,360; I0A:1D8; I0B:1EC; I0C:204,210,460,46C; I0D:330; I0E:4A8` |
| `F06C8` | `I00:014; I01:024; I0F:068,0C0; I10:07C,22C,370,49C,648,690; I11:088; I12:09C; I13:0AC; I02:0D8; I03:0EC; I09:10C,678,6C0; I08:1B0,1FC,208,214; I14:220; I15:238,4A8; I16:244,2AC,468,52C,598,5F0; I17:264,54C; I18:270,558; I19:284,294,570,580; I1A:2A0,58C; I1B:2EC; I1C:34C; I1D:358; I1E:364; I04:37C; I05:388; I06:39C,620; I07:3B8,6C8; I0A:3D8; I0B:3EC,634; I1F:478,600; I0C:484,4B4,4C0,4CC; I20:490; F0DCC:518; I21:5DC; I0D:60C; I22:654,69C; I0E:6DC` |
| `F0DCC` | `I01:04C; I1C:0B0; I1D:0BC; I1E:0C4; I10:0CC` |
| `F0EC0` | `I23:004` |
| `F0EEC` | `I24:004` |
| `F0F34` | `I26:1A0; I25:1AC` |
| `F10EC` | `I27:02C; I28:03C,080,09C,108,128,194; I29:044?,0A4?,134?,1A0?; I2A:068,0E8,178,1C4; I2B:088?,114?; I2C:204,228,26C,294; I16:2A8; I2D:31C,3B8,48C,554; I2E:32C,3C8,49C,564; I2F:33C,3D8,4AC,574` |
| `F16CC` | `I30:044; I31:058` |
| `F1748` | `I32:02C,040,054,068; I28:084; I33:0A8` (last call follows a non-null allocation test) |

| Owner | Indirect linked-call sites, grouped by dispatch displacement |
| --- | --- |
| `F01CC` | `V48:150,244,290,30C,390,3C4,454; VD4:168,25C,418,430; VCC:180,274,3E8,400; VF4:1BC,2F0,374` |
| `F06C8` | `V48:140,18C,460; VD4:158,44C; VCC:170,434; VF4:1E4` |
| `F0DCC` | `V5C:028; V68:03C` |
| `F0F34` | `V10:01C,054,098,0D4; V04:034,06C,0B0,0EC,114,130,164,180` |
| `F10EC` | `V48:350,3EC,4C0,588; VD4:368,404,41C,4D8,4F0,5A0; V100:508` |

The complete direct tail-transfer schedule is:
`F06A0 +018 → F01CC`, `F06A0 +020 → F06C8`,
`F0EEC +00C → I25`, `F0EFC +000 → I24`, `F1834 +000 → I25`.
Each import veneer additionally performs its own indirect tail-transfer through
its adjacent slot. There are no other outgoing calls or tail transfers in
the proposed entry inventory. Return-only and initialization leaves have none.

## Behavioral facts for the other bodies

These facts retain opaque object and operation identities. They do not assign
SDK class names or reconstruct original strings or coordinate tables.

- **`F01B4`, 24 bytes:** Store the second argument at destination offset 24;
  read a word at offset 416 through that argument; write that derived word,
  the third and fourth arguments, and a zero word into the four-word region
  beginning at destination offset 28. Return the pointer to that region.
  No calls or literal accesses were observed.
- **`F01CC`, 1,168 code bytes:** Obtain two services from the context at
  object offset 24. Select one of ten states using the byte at offset 48;
  out-of-range states take the non-completion return. Use the signed index at
  offset 32 to select 24-byte records from the owner at offset 28, with a
  signed upper-bound test against twelve. This test is not evidence of a
  nonnegative-index guard. Operate on record banks beginning at offsets 60,
  636, and 924, including visibility/mode dispatches and completion probes.
  Some states invoke `F0DCC`, others wait for service predicates, and one
  counts frames in the word at offset 40 before advancing. Advance the state
  byte only on the designated paths. Return one on the final successful
  service condition and zero on non-completion paths. Embedded literals are
  skipped by control flow; retain the separate frame and VFP saved state.
- **`F06A0`, 40 bytes:** Inspect the word at offset 36. Value one tail-selects
  `F01CC`; value zero tail-selects `F06C8`; other values return zero. The two
  state-machine entries remain separate functions, with their own frames.
- **`F06C8`, 1,724 code bytes:** A second ten-state byte-driven procedure
  with its own larger temporary frame. It coordinates service predicates,
  actor masks, two small temporary records, and dispatches on the twelve
  24-byte record slots. It changes a progress counter at offset 44, updates
  selected fields in context-owned state, constructs and submits a temporary
  transform, and invokes `F0DCC` on a selected record. Several states clear
  or restore previously set control bits. Late states compare an obtained
  floating result against one opaque scalar identity before issuing an
  operation. Successful completion returns one; waiting/default paths return
  zero. This procedure is structurally distinct from `F01CC`.
- **Existing `F0DCC`, 224 bytes:** A null second argument is a no-op. Otherwise
  resolve an item by the address-taken identifier through two receiver
  dispatches. If resolution succeeds, derive a temporary transform from the
  item, submit it through `I1C`, `I1D`, `I1E`, then set the byte at offset 670
  in the object returned by `I10`. This description does not extend existing
  source ownership to the adjacent identifier or three operand words.
- **`F0EC0`, 40 bytes:** Invoke `I23` on the incoming destination, install the
  dispatch identity `R+01E8` in the returned object, clear words at offsets
  24, 28, and 44, and clear the byte at offset 48. It is not an all-fields
  zero initializer.
- **`F0F34`, 440 bytes:** Teardown handles at offset 20, two three-handle
  groups beginning at offsets 24 and 36, and the handle at offset 48. A
  present handle receives dispatch at displacement 16 followed by a renewed
  null test and dispatch at displacement 4. Then traverse two pairs of
  twelve-record banks, using stride 24 and bank starts 60/348 and 636/924;
  release present leading handles through displacement 4 and clear those
  handle fields. Finally, if the word at offset 12 is non-null, pass it to
  `I26` then `I25`, and clear that word. Preserve the different treatment of
  the small handle groups and the record banks.
- **`F10EC`, 1,468 bytes:** Initialize resources using the owner at offset 8
  and resource state at offset 12. Allocate six small objects, with constructor
  calls conditional on allocation success, and register the selected handles.
  Four bounded twelve-element construction operations populate four banks
  of 24-byte records beginning at offsets 60, 348, 636, and 924. Subsequent
  loops derive floating positions from two read-only coordinate-record
  regions, apply scale/offset operands, register each object through `I2D`,
  `I2E`, and `I2F`, and set differing dispatch modes for the banks. One bank
  also receives a dispatch at displacement 256. The coordinate values and
  resource-selector contents are deliberately unspecified here.
- **`F16CC`, 124 bytes:** Poll a word state at offset 16. State zero issues
  `I30` on the resource pointer at offset 12, then advances. State one waits
  on `I31` before advancing. State two changes to three. State three returns
  one; all other paths return zero. Advancing to three and reporting success
  occur on separate invocations.
- **`F1748`, 224 bytes:** Install dispatch identity `R+0208` and retain the
  incoming context. Invoke `I32` four times with callback `F01A0`, element
  size 24, count twelve, for the four record-bank regions. Allocate one
  additional object through `I28`; construct it through `I33` only if the
  allocation succeeded, supplying the construction descriptor `R+8`.
  Store the resulting resource handle, clear lifecycle state and small handle
  fields, and return the containing object.
- **`F183C`, 32 bytes:** Resolve `B+0`, load two distinct scalar operands,
  and initialize its first two words with one operand and its next two with
  the other. No calls occur. Neither floating operand is an address. This
  initializer has one reference from the module's initializer-pointer range.
- **`F1868`, 116 code bytes:** A five-command control dispatcher. Commands
  respectively write a zero result through the first argument, save that
  argument in `D+0`, retrieve the saved pointer through the argument, publish
  the one-element initialization range, or publish an empty read-only range.
  Valid commands return zero. An out-of-range command follows a separate
  scalar-result path. It does not call an error-reporting helper. Its table,
  pointer operands, and initializer pointer are non-executable metadata.

## Validation result

The proposed executable intervals and non-code intervals cover `[0,0x1918)`
once with no overlap, including the eight-byte identifier interval. There are
52 veneer bodies and 29 other bodies. The three split bodies own 1,168,
1,724, and 116 executable bytes respectively; their skipped dispatch and
literal words are counted separately. All 93 text relocations fall in
non-executable words, and every observed direct local call, tail target,
dispatch target, and PC-relative operand lands in its stated class.

This supports an analysis specification for all executable ranges while
leaving implementation and inventory acceptance to the separate implementation
and review roles.
