# ARM adjacent global loads 09

## Provenance and scope

- Target: `AS_EUR_REV2`
- Evidence source: independently observed behavior from the verified private target
- Analysis tools: GNU Arm Embedded `15.2.Rel1` assembler/readelf and objdiff CLI `3.8.2`
- Analysis date: 2026-10-15
- Analyst role: behavior/specification only; `src/main` was not inspected or edited

The audit considered every inventoried 12-byte ARM routine with this semantic
shape: obtain a base identity through the aligned word immediately following the
function, read one fixed-width value at a constant nonnegative byte displacement,
return that value, and perform no write. Every function already named by an
existing specification was excluded before acceptance.

The accepted set contains 79 functions and 47 distinct base identities. All base
words designate locations in a declared initialized-data or zero-initialized-data
segment. Identity labels below are local, neutral equality tokens; they do not
encode or disclose an address.

For the table, `u32` and `u8` mean an unsigned load returned as a 32-bit value,
while `s8` means an 8-bit load sign-extended to 32 bits. `+N` is a byte
displacement from the opaque base. Incoming argument registers are ignored.

| Neutral identity | Segment class | Functions and reads |
| --- | --- | --- |
| `global_load_01` | initialized data | `func_001076EC` (`u32 @ +16`); `func_0011D62C` (`u32 @ +240`) |
| `global_load_02` | initialized data | `func_0010963C` (`u32 @ +8`); `func_00145D44` (`u32 @ +4`); `func_00145D54` (`u32 @ +0`) |
| `global_load_03` | initialized data | `func_001098A8` (`s8 @ +0`); `func_0010FD8C` (`u32 @ +24`); `func_0010FE6C` (`u8 @ +10`); `func_0010FF10` (`s8 @ +9`); `func_0011009C` (`u8 @ +6`); `func_00110530` (`s8 @ +1`); `func_0011A6B4` (`s8 @ +13`); `func_0011B75C` (`u8 @ +5`); `func_00125F40` (`u32 @ +16`); `func_00125F70` (`u8 @ +12`); `func_00125F94` (`s8 @ +8`); `func_00125FB8` (`u8 @ +11`); `func_00125FDC` (`s8 @ +7`); `func_00126000` (`u32 @ +20`); `func_001261C0` (`u8 @ +3`); `func_0012649C` (`u8 @ +2`) |
| `global_load_04` | initialized data | `func_0010AB08` (`u32 @ +0`) |
| `global_load_05` | initialized data | `func_0010AB18` (`u32 @ +0`) |
| `global_load_06` | initialized data | `func_0010AB28` (`u32 @ +0`) |
| `global_load_07` | zero-initialized data | `func_0010E068` (`u32 @ +32`); `func_0010E088` (`u32 @ +0`); `func_0010E098` (`u32 @ +80`); `func_00117594` (`u32 @ +4`); `func_00122BE0` (`u32 @ +84`); `func_0048AFBC` (`s8 @ +118`) |
| `global_load_08` | initialized data | `func_0010FDE0` (`s8 @ +2`) |
| `global_load_09` | initialized data | `func_00110A20` (`s8 @ +1`) |
| `global_load_10` | initialized data | `func_0011204C` (`u32 @ +0`) |
| `global_load_11` | initialized data | `func_001152AC` (`s8 @ +0`) |
| `global_load_12` | initialized data | `func_001182C0` (`u32 @ +16`) |
| `global_load_13` | initialized data | `func_0011EB84` (`u32 @ +0`) |
| `global_load_14` | initialized data | `func_00125DB0` (`s8 @ +0`); `func_00125EB0` (`s8 @ +1`); `func_00164F64` (`u32 @ +28`); `func_001744A0` (`s8 @ +2`) |
| `global_load_15` | initialized data | `func_0012B8FC` (`u32 @ +0`) |
| `global_load_16` | initialized data | `func_0012B90C` (`u32 @ +0`) |
| `global_load_17` | initialized data | `func_0012B91C` (`u32 @ +0`) |
| `global_load_18` | initialized data | `func_0012B92C` (`u32 @ +0`) |
| `global_load_19` | initialized data | `func_0012B94C` (`u32 @ +0`) |
| `global_load_20` | initialized data | `func_0012B95C` (`u32 @ +0`) |
| `global_load_21` | initialized data | `func_00132ED8` (`u32 @ +0`) |
| `global_load_22` | initialized data | `func_0013395C` (`s8 @ +0`) |
| `global_load_23` | initialized data | `func_00139650` (`u32 @ +0`) |
| `global_load_24` | initialized data | `func_00139660` (`u32 @ +0`) |
| `global_load_25` | initialized data | `func_0014A204` (`s8 @ +1`) |
| `global_load_26` | initialized data | `func_0014B80C` (`u32 @ +0`) |
| `global_load_27` | initialized data | `func_0014E348` (`u32 @ +0`) |
| `global_load_28` | initialized data | `func_0014E358` (`u32 @ +0`) |
| `global_load_29` | initialized data | `func_001732BC` (`u32 @ +388`); `func_002251F8` (`u32 @ +184`); `func_00238094` (`u32 @ +356`); `func_0026CF98` (`u32 @ +336`); `func_0028D178` (`u32 @ +164`) |
| `global_load_30` | zero-initialized data | `func_00173ACC` (`u32 @ +812`) |
| `global_load_31` | initialized data | `func_0017E4D8` (`s8 @ +1`) |
| `global_load_32` | initialized data | `func_00190400` (`s8 @ +4`) |
| `global_load_33` | initialized data | `func_001C86FC` (`u8 @ +0`) |
| `global_load_34` | initialized data | `func_001D25E0` (`s8 @ +0`) |
| `global_load_35` | initialized data | `func_001F9E04` (`s8 @ +0`) |
| `global_load_36` | initialized data | `func_001FA9EC` (`u8 @ +3`) |
| `global_load_37` | initialized data | `func_001FC264` (`s8 @ +0`) |
| `global_load_38` | initialized data | `func_001FF190` (`s8 @ +0`) |
| `global_load_39` | initialized data | `func_0028D244` (`u8 @ +10`) |
| `global_load_40` | initialized data | `func_002BC6E8` (`s8 @ +1`); `func_002BC6F8` (`s8 @ +0`) |
| `global_load_41` | initialized data | `func_002C2384` (`s8 @ +1`); `func_002C2394` (`s8 @ +0`) |
| `global_load_42` | initialized data | `func_003A7D68` (`u32 @ +0`) |
| `global_load_43` | initialized data | `func_003A7D98` (`u32 @ +0`) |
| `global_load_44` | initialized data | `func_003A7DB8` (`u32 @ +0`) |
| `global_load_45` | initialized data | `func_004119C4` (`s8 @ +2`) |
| `global_load_46` | initialized data | `func_00419058` (`u8 @ +1`) |
| `global_load_47` | initialized data | `func_0042D09C` (`s8 @ +4`) |

Two otherwise matching shapes were rejected because their adjacent words fall
outside every declared process-image segment: `func_0010702C` and
`func_002BA6CC`. Their words are scalar values, not address identities, and must
not be replaced by relocations merely to obtain a match.

## Neutral mapping and validation requirements

The implementation should store the table as structured neutral metadata. It
must contain only function name, opaque identity, segment class, read type, and
byte displacement. The private target builder must reject an entry unless:

1. the inventory says ARM mode and a 12-byte function body;
2. the body has exactly the audited obtain-base, fixed-width-read, return shape;
3. the aligned four-byte identity slot begins immediately after the body, is in
   bounds, and overlaps no inventoried function;
4. the private identity word belongs to the declared segment class;
5. identity equality is biconditional with private-word equality across all 79
   entries (same identity if and only if the private words are equal);
6. the decoded signedness, width, and displacement equal the neutral metadata;
7. neither rejected scalar function is configured.

For each entry, both target and base objects must have a dedicated executable,
four-byte-aligned section of 16 bytes, but a global function symbol whose extent
is exactly 12 bytes. The adjacent identity slot is therefore outside the function
extent. It must carry one `R_ARM_ABS32` relocation at section offset 12 against
the configured global undefined zero-size `NOTYPE` identity. The target builder
must never emit the private identity word. A validator must inspect section flags,
alignment and size, function symbol binding/type/extent, undefined identity
symbol, relocation type/offset/identity, and exact mapping cardinalities.

## Exact textual-assembly probe

An ignored probe generated the target side from the three privately observed
instructions while replacing every adjacent word with its neutral relocation.
The independently expressed base side used textual ARM assembly derived only
from the behavior table. GNU `readelf` inspection confirmed the outside-extent
layout, and objdiff 3.8.2 reported all 79 functions exact: 948 of 948 function
bytes, with 79 of 79 functions matched. The adjacent relocation slots do not
inflate the code-byte total.
