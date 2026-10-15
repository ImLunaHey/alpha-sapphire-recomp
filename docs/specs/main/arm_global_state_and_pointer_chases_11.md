# ARM global state and pointer chases 11

## Provenance and scope

- Target: `AS_EUR_REV2`
- Evidence source: independently observed behavior from the verified private target
- Analysis tools: GNU Arm Embedded `15.2.Rel1` objdump, assembler, objcopy, and readelf
- Analysis date: 2026-10-15
- Analyst role: behavior/specification only; `src/main` was not inspected or edited

This bounded batch contains 97 short ARM routines (1,544 function bytes). Each
routine obtains exactly one global identity through the aligned word immediately
following its function body. The word is data, not part of the function extent.
Every identity was classified against the target manifest's half-open segment
ranges. No target word or private address is recorded here.

`a0` and `a1` below are the incoming 32-bit argument words. Operations separated
by a semicolon occur in the stated order. Loads and stores are unsigned unless
explicitly marked signed. Existing neutral identities are intentionally reused
when private-word equality was observed across this and an earlier audited batch.
New `global_state_NN` labels are equality tokens local to this specification.

## Direct and fixed-value stores

| Identity | Segment | Functions and behavior |
| --- | --- | --- |
| `global_state_01` | initialized data | `func_00107170` (12 B): store8 `a0` at +0 |
| `global_load_22` | initialized data | `func_001071D0` (16 B): store32 `a0` at +44; store32 `a1` at +108. `func_001071E4` (16 B): store32 `a0` at +32; store32 `a1` at +96. `func_002DD930` (16 B): store32 `a0` at +20; store32 `a1` at +84 |
| `global_state_02` | initialized data | `func_001096BC` (12 B): store32 `a0` at +0 |
| `global_state_03` | initialized data | `func_00109B54` (12 B): store32 `a0` at +8. `func_00109B64` (16 B): store8 1 at +0. `func_00109B84` (12 B): store8 `a0` at +1. `func_00109B94` (12 B): store32 `a0` at +4 |
| `global_load_01` | initialized data | `func_0010A478` (12 B): store32 `a0` at +76. `func_0010A49C` (16 B): store32 `a1` at +80; store32 `a0` at +84. `func_0010AB38` (12 B): store32 `a0` at +24. `func_0010AC24` (12 B): store32 `a0` at +108 |
| `global_load_46` | initialized data | `func_0010B468` (12 B): store8 `a0` at +1 |
| `global_load_14` | initialized data | `func_0010FCE0` (16 B): store8 1 at +1 |
| `global_load_03` | initialized data | `func_0010FDBC` (12 B): store32 `a0` at +24. `func_0010FF20` (16 B): store8 1 at +9. `func_0010FF34` (12 B): store32 `a0` at +20. `func_00110540` (16 B): store8 1 at +1. `func_0011A694` (12 B): store8 `a0` at +12. `func_0011A6A4` (12 B): store8 `a0` at +11. `func_0011AB7C` (12 B): store8 `a0` at +13. `func_0011B76C` (12 B): store8 `a0` at +5. `func_0011B77C` (12 B): store8 `a0` at +6. `func_00125F50` (12 B): store32 `a0` at +16. `func_00125F60` (12 B): store8 `a0` at +10. `func_00125F80` / `func_00125FA4` (16 B each): store8 1 / 0 at +8. `func_00125FC8` / `func_00125FEC` (16 B each): store8 1 / 0 at +7. `func_00126010` (16 B): store8 0 at +1. `func_001261D0` (12 B): store8 `a0` at +4. `func_001261E0` (12 B): store8 `a0` at +3. `func_001263DC` (16 B): store8 0 at +3. `func_001265B8` (12 B): store8 `a0` at +2. `func_001265C8` (16 B): store8 0 at +2 |
| `global_state_04` | initialized data | `func_0010FFC4` (12 B): store32 `a0` at +0 |
| `global_state_05` | initialized data | `func_00112914` (12 B): store32 `a0` at +0 |
| `global_state_06` | initialized data | `func_00118334` (12 B): store32 `a0` at +0 |
| `global_state_07` | initialized data | `func_0011B704` (12 B): perform one 64-bit paired store using `a0` as the low word and `a1` as the high word, beginning at +4 (therefore writing `a0` at +4 and `a1` at +8) |
| `global_state_08` | initialized data | `func_001242D0` (12 B): store8 `a0` at +0 |
| `global_state_09` | zero-initialized data | `func_0013294C` (16 B): store32 1 at +16 |
| `global_state_10` | zero-initialized data | `func_00132960` (16 B): store32 -1 at +32 |
| `global_state_11` | zero-initialized data | `func_00132974` (16 B): store32 -1 at +68 |
| `global_state_12` | zero-initialized data | `func_00132A00` (16 B): store32 -1 at +32 |
| `global_state_13` | initialized data | `func_00134924` / `func_00134958` (12 B each): store32 `a0` at +0 / +4 |
| `global_load_29` | initialized data | `func_00146768` (12 B): store8 `a0` at +1. `func_00206708` (12 B): store8 `a0` at +23. `func_002A0690` (12 B): store8 `a0` at +14 |
| `global_state_15` | initialized data | `func_001C3228` (12 B): store32 `a0` at +0 |
| `global_load_33` | initialized data | `func_001C3D7C` (16 B): store8 0 at +0 |
| `global_state_16` | initialized data | `func_001D2250` (12 B): store8 `a0` at +11. `func_001D2278` (12 B): store8 `a0` at +19. `func_001D2288` (12 B): store8 `a0` at +10. `func_001D2298` (12 B): store8 `a0` at +0 |
| `global_state_17` | initialized data | `func_001D2958` (12 B): store16 `a0` at +0. `func_001D2968` (12 B): store32 `a0` at +16 |
| `global_state_18` | initialized data | `func_001FF180` (12 B): store32 `a0` at +4 |
| `global_load_39` | initialized data | `func_002AC084` / `func_002AC094` (12 B each): store32 `a0` at +56 / +52 |
| `global_state_19` | initialized data | `func_002C21AC` (16 B): store8 13 at +1 |
| `global_load_07` | zero-initialized data | `func_0048AE48` (16 B): store8 1 at +117 |

## Ordered updates and multi-field writes

| Identity | Segment | Function and behavior |
| --- | --- | --- |
| `global_load_09` | initialized data | `func_0011C368` (24 B): read8 +2; store8 `((a0 XOR 255) AND old)` at +2 |
| `global_state_14` | initialized data | `func_00140C88` (20 B): read32 +0; store32 0 at +0; return the old value |
| `global_state_16` | initialized data | `func_001D2260` (20 B): store8 (`a0 != 0 ? 4 : 0`) at +15 |
| `global_load_39` | initialized data | `func_002A9DF0` (20 B): read32 +64; store32 `a0` at +64; return the old value |
| `opaque_39` | initialized data | `func_0040ECA8` (24 B): store32 0 at +0; then store32 0 at +4 |
| `global_state_20` | initialized data | `func_0040F3B8` (20 B): store32 `a0` at +4; then store8 1 at +0. `func_0041107C` (20 B): store32 `a0` at +12; then store8 1 at +2. `func_00411094` (20 B): store32 `a0` at +8; then store8 1 at +1 |
| `global_load_26` | initialized data | `func_0050D54C` (20 B): read32 +0; add `a0`; store32 the sum at +0; return the sum |
| `global_state_21` | initialized data | `func_005298E8` (20 B): store32 0 at +0; then store32 0 at +12 |
| `global_state_22` | zero-initialized data | `func_00529940` (20 B): store32 0 at +4; then store32 0 at +0 |

Two extents and forms are especially important to preserve:

- `func_0011B704` is exactly 12 bytes, not 16. Its two logical word writes are
  one paired 64-bit store. Implementations must select a dedicated paired-store
  form rather than expanding the behavior to two independent word stores. The
  semantic instruction sequence is: obtain the identity in `r2`; execute ARM
  `STRD r0, r1, [r2, #4]` using positive immediate-offset addressing with no
  writeback; return through `lr`. GNU objdump conventionally omits the implicit
  odd partner and renders the middle instruction as `strd r0, [r2, #4]`; this is
  the same paired store, not an `STM` and not an `LDRD`.
- `func_0040ECA8` is exactly 24 bytes, not 20. It clears the first word, advances
  the working global pointer by four bytes, and then clears the second word. Its
  form metadata must preserve that ordered pointer-advance shape. Its complete
  semantic sequence is: load the adjacent `opaque_39` identity into `r1`; move
  immediate zero into `r0`; store `r0` through `[r1, #0]`; add immediate 4 from
  `r1` back into `r1`; store the still-zero `r0` through the advanced
  `[r1, #0]`; return through `lr`. Thus `r0`, not `r1`, is the zero source, and
  the pointer advance updates the base register in place rather than producing a
  separate destination register.

## Pointer-chase and derived-value routines

All listed reads are volatile observations for purposes of ordering. A conditional
form performs only the reads stated on its taken path.

| Identity | Segment | Function and behavior |
| --- | --- | --- |
| `global_load_01` | initialized data | `func_0010A488` (16 B): `p = load32(+84)`; return `load32(p + a0*4)` |
| `global_load_42` | initialized data | `func_0010E2B4` (16 B): `p = load32(+0)`; return `load32(p + 4)` |
| `global_state_23` | initialized data | `func_0010EED4` (20 B): `p = load32(+0)`; return `p == 0 ? 0 : p + 128`. `func_0010EF3C` (24 B): `p = load32(+0)`; return `p == 0 ? 3 : load32(p + 0)` |
| `global_load_03` | initialized data | `func_0010FD9C` (28 B): return `(load32(+24) & 7) == 6`. `func_0010FDCC` (16 B): return `load32(+24) & 7`. `func_00125F24` (24 B): return `(load32(+24) & 7) == 0`. `func_0013396C` (28 B): return `(load32(+24) & 7) == 2` |
| `global_load_09` | initialized data | `func_00110A44` (20 B): `mask = load8(+2)`; return `(a0 & mask) != 0` |
| `global_state_24` | initialized data | `func_001285D8` (16 B): `p = load32(+0)`; return `load8(p + 0)` |
| `global_load_29` | initialized data | `func_0014718C` / `func_001471A0` (16 B each): `p = load32(+356)`; return `p + 476` / `p + 504`. `func_0026BCD8` (20 B): `p = load32(+464)`; return `p == 0 ? 0 : load32(p + 8)`. `func_004AB9A8` / `func_004AB9C4` (24 B each): if `load32(+336) != 0`, return 3; otherwise return `load8(a0 + 26)` / `load8(a0 + 27)` |
| `global_load_14` | initialized data | `func_0014881C` (20 B): `p = load32(+28)`; return signed `load8(p + 117)`. `func_00148880` (16 B): return `load32(+12)` |
| `global_state_25` | initialized data | `func_001F4098` (20 B): return `load32(+0) != 0` |
| `global_state_26` | initialized data | `func_001FAB00` (32 B): `p = load32(+12)`; return `load8(p + 8) == 2 ? load8(p + 10) : 0`. `func_001FACCC` (20 B): `p = load32(+12)`; return `load8(p + 8)` |
| `global_state_27` | initialized data | `func_002C2E74` (24 B): return `a0 < load16(+0)` |
| `global_state_28` | initialized data | `func_004F2DCC` (20 B): `p = load32(+0)`; `p = load32(p + 8)`; return `load32(p + 12)` |
| `global_state_29` | zero-initialized data | `func_00529900` (12 B): return `load32(a0*4)` |

## Deterministic A32 generation templates

The behavior tables above are the interface contract. This section additionally
records the register allocation and addressing forms needed to reproduce the
audited A32 bodies deterministically. `LIT(R)` means an `AL`-conditioned positive
PC-relative word `LDR` into `R`, targeting this function's sole adjacent identity
slot. `RET` means `BX lr`. Unsuffixed operations are `AL`; conditional suffixes
shown below are mandatory. An offset of zero uses `[base]`. Validators must decode
and compare mnemonic, condition, registers, shift, immediate, pre/post indexing,
and writeback rather than accepting semantic equivalence.

### Incoming-value stores

Template `STORE_IN(kind, offset)` is:

```text
LIT(r1); STR{kind} r0, [r1, #offset]; RET
```

Here `kind=w` means `STR`, `b` means `STRB`, and `h` means `STRH`.

| Function | kind | offset | Function | kind | offset |
| --- | --- | ---: | --- | --- | ---: |
| `func_00107170` | b | 0 | `func_001096BC` | w | 0 |
| `func_00109B54` | w | 8 | `func_00109B84` | b | 1 |
| `func_00109B94` | w | 4 | `func_0010A478` | w | 76 |
| `func_0010AB38` | w | 24 | `func_0010AC24` | w | 108 |
| `func_0010B468` | b | 1 | `func_0010FDBC` | w | 24 |
| `func_0010FF34` | w | 20 | `func_0010FFC4` | w | 0 |
| `func_00112914` | w | 0 | `func_00118334` | w | 0 |
| `func_0011A694` | b | 12 | `func_0011A6A4` | b | 11 |
| `func_0011AB7C` | b | 13 | `func_0011B76C` | b | 5 |
| `func_0011B77C` | b | 6 | `func_001242D0` | b | 0 |
| `func_00125F50` | w | 16 | `func_00125F60` | b | 10 |
| `func_001261D0` | b | 4 | `func_001261E0` | b | 3 |
| `func_001265B8` | b | 2 | `func_00134924` | w | 0 |
| `func_00134958` | w | 4 | `func_00146768` | b | 1 |
| `func_001C3228` | w | 0 | `func_001D2250` | b | 11 |
| `func_001D2278` | b | 19 | `func_001D2288` | b | 10 |
| `func_001D2298` | b | 0 | `func_001D2958` | h | 0 |
| `func_001D2968` | w | 16 | `func_001FF180` | w | 4 |
| `func_00206708` | b | 23 | `func_002A0690` | b | 14 |
| `func_002AC084` | w | 56 | `func_002AC094` | w | 52 |

Template `STORE_FIXED(op, immediate, kind, offset)` is:

```text
LIT(r1); op r0, #immediate; STR{kind} r0, [r1, #offset]; RET
```

`MVN #0` is the required representation of -1.

| Function | op | immediate | kind | offset |
| --- | --- | ---: | --- | ---: |
| `func_00109B64` | MOV | 1 | b | 0 |
| `func_0010FCE0` | MOV | 1 | b | 1 |
| `func_0010FF20` | MOV | 1 | b | 9 |
| `func_00110540` | MOV | 1 | b | 1 |
| `func_00125F80` | MOV | 1 | b | 8 |
| `func_00125FA4` | MOV | 0 | b | 8 |
| `func_00125FC8` | MOV | 1 | b | 7 |
| `func_00125FEC` | MOV | 0 | b | 7 |
| `func_00126010` | MOV | 0 | b | 1 |
| `func_001263DC` | MOV | 0 | b | 3 |
| `func_001265C8` | MOV | 0 | b | 2 |
| `func_0013294C` | MOV | 1 | w | 16 |
| `func_00132960` | MVN | 0 | w | 32 |
| `func_00132974` | MVN | 0 | w | 68 |
| `func_00132A00` | MVN | 0 | w | 32 |
| `func_001C3D7C` | MOV | 0 | b | 0 |
| `func_002C21AC` | MOV | 13 | b | 1 |
| `func_0048AE48` | MOV | 1 | b | 117 |

Template `STORE_TWO_WB(first, second, pre, post)` is:

```text
LIT(r2); STR first, [r2, #pre]!; STR second, [r2, #post]; RET
```

The second offset is relative to the already updated `r2`.

| Function | first | second | pre | post |
| --- | --- | --- | ---: | ---: |
| `func_001071D0` | r0 | r1 | 44 | 64 |
| `func_001071E4` | r0 | r1 | 32 | 64 |
| `func_0010A49C` | r1 | r0 | 80 | 4 |
| `func_002DD930` | r0 | r1 | 20 | 64 |

`func_0011B704` uses the dedicated `STRD` form specified above and is not an
instance of `STORE_TWO_WB`.

### Updates and multi-field writes

The following complete sequences are templates in their own right. `W` and `F`
are the parameters for `STORE_AND_FLAG`.

```text
STORE_AND_FLAG(W,F): LIT(r1); MOV r2,#1; STR r0,[r1,#W]; STRB r2,[r1,#F]; RET
```

| Function | W | F |
| --- | ---: | ---: |
| `func_0040F3B8` | 4 | 0 |
| `func_0041107C` | 12 | 2 |
| `func_00411094` | 8 | 1 |

| Function | Exact semantic A32 sequence |
| --- | --- |
| `func_0011C368` | `LIT(r1); EOR r0,r0,#255; LDRB r2,[r1,#2]; AND r0,r0,r2; STRB r0,[r1,#2]; RET` |
| `func_00140C88` | `LIT(r1); MOV r2,#0; LDR r0,[r1]; STR r2,[r1]; RET` |
| `func_001D2260` | `LIT(r1); CMP r0,#0; MOVNE r0,#4; STRB r0,[r1,#15]; RET` |
| `func_002A9DF0` | `LIT(r1); LDR r2,[r1,#64]; STR r0,[r1,#64]; MOV r0,r2; RET` |
| `func_0050D54C` | `LIT(r1); LDR r2,[r1]; ADD r0,r0,r2; STR r0,[r1]; RET` |
| `func_005298E8` | `LIT(r0); MOV r1,#0; STR r1,[r0]; STR r1,[r0,#12]; RET` |
| `func_00529940` | `LIT(r0); MOV r1,#0; STR r1,[r0,#4]; STR r1,[r0]; RET` |

`func_0040ECA8` uses its dedicated six-instruction form below; register-swapping
it with either of the last two clear templates is invalid.

### Pointer chases and derived values

| Function | Exact semantic A32 sequence |
| --- | --- |
| `func_0010A488` | `LIT(r1); LDR r1,[r1,#84]; LDR r0,[r1,r0,LSL #2]; RET` |
| `func_0010E2B4` | `LIT(r0); LDR r0,[r0]; LDR r0,[r0,#4]; RET` |
| `func_0010EED4` | `LIT(r0); LDR r0,[r0]; CMP r0,#0; ADDNE r0,r0,#128; RET` |
| `func_0010EF3C` | `LIT(r0); LDR r0,[r0]; CMP r0,#0; LDRNE r0,[r0]; MOVEQ r0,#3; RET` |
| `func_0010FD9C` | `LIT(r0); LDR r0,[r0,#24]; AND r0,r0,#7; CMP r0,#6; MOVEQ r0,#1; MOVNE r0,#0; RET` |
| `func_0010FDCC` | `LIT(r0); LDR r0,[r0,#24]; AND r0,r0,#7; RET` |
| `func_00110A44` | `LIT(r1); LDRB r1,[r1,#2]; ANDS r0,r0,r1; MOVNE r0,#1; RET` |
| `func_00125F24` | `LIT(r0); LDR r0,[r0,#24]; TST r0,#7; MOVEQ r0,#1; MOVNE r0,#0; RET` |
| `func_001285D8` | `LIT(r0); LDR r0,[r0]; LDRB r0,[r0]; RET` |
| `func_0013396C` | `LIT(r0); LDR r0,[r0,#24]; AND r0,r0,#7; CMP r0,#2; MOVEQ r0,#1; MOVNE r0,#0; RET` |
| `func_0014718C` | `LIT(r0); LDR r0,[r0,#356]; ADD r0,r0,#476; RET` |
| `func_001471A0` | `LIT(r0); LDR r0,[r0,#356]; ADD r0,r0,#504; RET` |
| `func_0014881C` | `MOV r0,r0; LIT(r0); LDR r0,[r0,#28]; LDRSB r0,[r0,#117]; RET` |
| `func_00148880` | `MOV r0,r0; LIT(r0); LDR r0,[r0,#12]; RET` |
| `func_001F4098` | `LIT(r0); LDR r0,[r0]; CMP r0,#0; MOVNE r0,#1; RET` |
| `func_001FAB00` | `MOV r0,r0; LIT(r0); LDR r0,[r0,#12]; LDRB r1,[r0,#8]; CMP r1,#2; LDRBEQ r0,[r0,#10]; MOVNE r0,#0; RET` |
| `func_001FACCC` | `MOV r0,r0; LIT(r0); LDR r0,[r0,#12]; LDRB r0,[r0,#8]; RET` |
| `func_0026BCD8` | `LIT(r0); LDR r0,[r0,#464]; CMP r0,#0; LDRNE r0,[r0,#8]; RET` |
| `func_002C2E74` | `LIT(r1); LDRH r1,[r1]; CMP r0,r1; MOVCC r0,#1; MOVCS r0,#0; RET` |
| `func_004AB9A8` | `LIT(r1); LDR r1,[r1,#336]; CMP r1,#0; LDRBEQ r0,[r0,#26]; MOVNE r0,#3; RET` |
| `func_004AB9C4` | `LIT(r1); LDR r1,[r1,#336]; CMP r1,#0; LDRBEQ r0,[r0,#27]; MOVNE r0,#3; RET` |
| `func_004F2DCC` | `LIT(r0); LDR r0,[r0]; LDR r0,[r0,#8]; LDR r0,[r0,#12]; RET` |
| `func_00529900` | `LIT(r1); LDR r0,[r1,r0,LSL #2]; RET` |

The initial `MOV r0,r0` in the four listed pointer templates is the legacy A32
no-op encoding and is mandatory; it must not be replaced by another architectural
NOP spelling. These tables cover all 95 routines that were fuzzy before the two
special forms were corrected; together with the dedicated `STRD` and six-step
clear forms, they cover all 97 entries.

## Neutral mapping and validator requirements

The implementation metadata must record only the function name, exact function
size, neutral identity, segment class, and the behavior fields needed to select
the audited textual-assembly form. The private builder must reject an entry unless:

1. the inventory reports ARM mode and the exact size above;
2. the decoded reads, writes, widths, offsets, conditions, return value, and
   side-effect order equal this specification;
3. the single aligned identity slot begins exactly at the function end, is in
   bounds, and overlaps no inventoried function;
4. the private word belongs to the declared initialized-data or BSS segment;
5. identity equality is biconditional with private-word equality, including the
   identities reused from batches 07 and 09; and
6. every generated section and symbol passes the structural checks below.

The validator must also assign a distinct form discriminator to the 12-byte
paired store `func_0011B704` and the 24-byte pointer-advance clear
`func_0040ECA8`; a generic two-store form is not valid for either routine.

For `func_0011B704`, a public ARM A32 encoding check for the middle instruction
may use `(instruction & 0x0ff000f0) == 0x01c000f0`, then separately require
condition `AL`, base register `r2`, even transfer register `r0` (whose implicit
partner is `r1`), and split immediate value 4. The split immediate is decoded as
`((instruction >> 4) & 0xf0) | (instruction & 0x0f)`. The fixed low opcode nibble
is `0xf0`; using the `LDRD` nibble would incorrectly reject this store. The
surrounding instructions must retain the audited obtain-identity and `BX lr`
forms, and the adjacent relocation remains at byte offset 12.

For `func_0040ECA8`, all six instructions have condition `AL`. A validator may
apply the following public A32 family masks and then enforce the listed operand
fields in order:

1. `(instruction & 0x0fff0000) == 0x059f0000`: positive `LDR` literal, transfer
   register `r1`, immediate 16. This reaches the identity slot at byte offset 24.
2. `(instruction & 0x0fff0000) == 0x03a00000`: immediate `MOV`, destination
   `r0`, encoded immediate zero.
3. `(instruction & 0x0ff00000) == 0x05800000`: positive pre-indexed word `STR`
   without writeback, source `r0`, base `r1`, immediate zero.
4. `(instruction & 0x0ff00000) == 0x02800000`: immediate `ADD` without flags,
   source `r1`, destination `r1`, rotation-zero immediate 4.
5. The same `STR` family and fields as instruction 3: source `r0`, now-advanced
   base `r1`, immediate zero.
6. `(instruction & 0x0fffffff) == 0x012fff1e`: `BX lr`.

Its function symbol ends after instruction 6 at byte offset 24. The following
word is outside the function and carries the `R_ARM_ABS32` relocation against
`opaque_39`.

Each function must occupy a dedicated executable, four-byte-aligned section of
`function_size + 4` bytes. Its global `FUNC` symbol has exactly `function_size`
bytes. The adjacent word is outside that extent and has one `R_ARM_ABS32`
relocation at offset `function_size` against the configured global undefined,
zero-size `NOTYPE` identity. The target builder must never emit the private word.
The validator must additionally reject extra relocations, extra configured
functions, missing identities, wrong section flags/alignment, and a relocation
whose symbol disagrees even when objdiff would otherwise pair it.

## Exact textual-assembly probe

An ignored probe independently expressed each behavior as textual ARM assembly
and replaced its adjacent identity word with the neutral relocation described
above. The assembler reproduced all 97 target function bodies exactly: 1,544 of
1,544 function bytes. The adjacent slots remained outside the function symbols
and therefore do not inflate matched-code accounting. Two multi-identity table
lookups were deliberately left for a later batch so this contract retains the
one-function/one-adjacent-identity invariant.

A second mechanical extent audit compared all 97 entries with
`symbols/code.bin.csv` and with the exact probe symbols. It found 42 12-byte, 29
16-byte, 16 20-byte, seven 24-byte, two 28-byte, and one 32-byte functions, totaling
1,544 bytes. No size or shape inconsistency was found beyond guarding the two
special forms called out above; in particular, the authoritative extents are 12
bytes for `func_0011B704` and 24 bytes for `func_0040ECA8`.
