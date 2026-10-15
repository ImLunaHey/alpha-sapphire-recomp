# ARM adjacent multi-identity globals 12

## Provenance and bounded scope

- Target: `AS_EUR_REV2`
- Evidence source: independently observed behavior from the verified private target
- Analysis tools: GNU Arm Embedded `15.2.Rel1` objdump, assembler, objcopy, and readelf; objdiff CLI `3.8.2`
- Analysis date: 2026-10-16
- Analyst role: behavior/specification only; `src/main` was not inspected or edited

This batch contains nine previously unspecified and unmatched A32 leaf routines,
totalling 220 function bytes. The bounded inventory scan accepted an ARM routine
only when it was at most 32 bytes, ended in `BX lr`, used at least two consecutive
aligned address-identity words beginning exactly at the function end, and had no
call. Existing specifications were excluded before acceptance.

One additional structural candidate was rejected after semantic classification:
two of its three adjacent words are arithmetic constants used by a multiply-add,
not address identities. Merely falling numerically inside a process-image segment
does not turn a scalar into an identity.

Identity labels below are neutral equality tokens and disclose no target word or
address. `global_state_19` and `global_load_46` deliberately reuse identities
established by earlier specifications. All `multi_identity_NN` labels are new.

## Identities and literal-slot layouts

Slot offsets are relative to the end of the function symbol. Every slot is four
bytes and the slots are consecutive in the stated order.

| Function | Size | Slot identities and segment classes |
| --- | ---: | --- |
| `func_0021712C` | 32 | `+0 multi_identity_01` (read-only data), `+4 multi_identity_02` (read-only data) |
| `func_00237758` | 16 | `+0 multi_identity_03` (read-only data), `+4 multi_identity_04` (read-only data) |
| `func_0026E970` | 20 | `+0 multi_identity_03` (read-only data), `+4 multi_identity_04` (read-only data) |
| `func_002A2490` | 20 | `+0 multi_identity_05` (read-only data), `+4 multi_identity_06` (read-only data) |
| `func_002C2244` | 20 | `+0 global_state_19` (initialized data), `+4 multi_identity_12` (zero-initialized data) |
| `func_0032DCD0` | 28 | `+0 multi_identity_07` (read-only data), `+4 multi_identity_08` (read-only data), `+8 multi_identity_09` (read-only data) |
| `func_003D4668` | 28 | `+0 multi_identity_10` (text), `+4 multi_identity_11` (text) |
| `func_004191B0` | 24 | `+0 global_load_46` (initialized data), `+4 multi_identity_13` (read-only data) |
| `func_0041CE10` | 32 | `+0 multi_identity_14` (read-only data), `+4 multi_identity_15` (read-only data) |

The two shared read-only identities are shared biconditionally: the first slots of
`func_00237758` and `func_0026E970` are equal, their second slots are equal, and
no other new slot word equals either one. Apart from those two repetitions and
the two explicit earlier-identity reuses, all new identity words are pairwise
distinct and distinct from every previously configured identity.

## Observable behavior

`a0`, `a1`, and `a2` denote incoming 32-bit argument words. Identity-valued
stores write the identity itself. Operations separated by semicolons occur in
the stated order.

| Function | Behavior |
| --- | --- |
| `func_0021712C` | Let `p = a0`. Store `multi_identity_01` at `p+0`; read two consecutive 32-bit words at `multi_identity_02+0` and `+4`; store `a1` at `p+12`; store `a2` at `p+16`; then store the two read words at `p+4` and `p+8`, respectively. Return `p`. |
| `func_00237758` | Store `multi_identity_03` at `a0+0` and `multi_identity_04` at `a0+4` with one ascending multi-register store. Return `a0`. |
| `func_0026E970` | Store `multi_identity_03` at `a0+4`; then store `multi_identity_04` at `a0+8`. Return `a0`. |
| `func_002A2490` | Store `multi_identity_05` at `a0+0`; then store `multi_identity_06` at `a0+8`. Return `a0`. |
| `func_002C2244` | Ignore incoming arguments. Read an unsigned byte at `global_state_19+1`; use it as an index into 32-bit elements beginning at `multi_identity_12`; return the selected word. No write occurs. |
| `func_0032DCD0` | Store `multi_identity_08` at `a0+140`; then `multi_identity_07` at `a0+0`; then `multi_identity_09` at `a0+64`. Return `a0`. |
| `func_003D4668` | Store zero at original `a0+36`; then store `multi_identity_10` at original `a0+28`; then store `multi_identity_11` at original `a0+32`; return original `a0+28`. |
| `func_004191B0` | Let `index = a0`. If `index == 8`, replace it with the unsigned byte read at `global_load_46+1`. Return the 32-bit element at `multi_identity_13 + index*4`. The byte read does not occur when `a0 != 8`. |
| `func_0041CE10` | Store `multi_identity_14` at `a0+0`; store `multi_identity_15` at `a0+284`; store zero as an 8-bit value at `a0+280`; store zero as a 32-bit value at `a0+228`; return `a0`. |

## Deterministic A32 templates

`LIT(R,S)` means an `AL` positive PC-relative word `LDR` into register `R`
targeting slot `S`. `LITEQ` is the same operation with condition `EQ`. `RET`
means `BX lr`. Every omitted condition is `AL`. Validators must compare the full
mnemonic, condition, registers, immediate, shift, addressing mode, writeback, and
instruction order, not merely equivalent behavior.

| Function | Complete instruction sequence |
| --- | --- |
| `func_0021712C` | `LIT(r3,0); LIT(ip,1); STR r3,[r0]; LDMIA ip,{r3,ip}; STR r1,[r0,#12]; STR r2,[r0,#16]; STMIB r0,{r3,ip}; RET` |
| `func_00237758` | `LIT(r1,0); LIT(r2,1); STMIA r0,{r1,r2}; RET` |
| `func_0026E970` | `LIT(r2,0); STR r2,[r0,#4]; LIT(r2,1); STR r2,[r0,#8]; RET` |
| `func_002A2490` | `LIT(r1,0); LIT(r2,1); STR r1,[r0]; STR r2,[r0,#8]; RET` |
| `func_002C2244` | `LIT(r0,0); LDRB r1,[r0,#1]; LIT(r0,1); LDR r0,[r0,r1,LSL #2]; RET` |
| `func_0032DCD0` | `LIT(r2,1); LIT(r1,0); STR r2,[r0,#140]; LIT(r2,2); STR r1,[r0]; STR r2,[r0,#64]; RET` |
| `func_003D4668` | `LIT(r2,0); MOV r1,#0; STR r1,[r0,#36]; LIT(r1,1); STR r2,[r0,#28]!; STR r1,[r0,#4]; RET` |
| `func_004191B0` | `CMP r0,#8; LITEQ(r0,0); LIT(r1,1); LDRBEQ r0,[r0,#1]; LDR r0,[r1,r0,LSL #2]; RET` |
| `func_0041CE10` | `LIT(r1,0); LIT(r2,1); STR r1,[r0]; MOV r1,#0; STR r2,[r0,#284]; STRB r1,[r0,#280]; STR r1,[r0,#228]; RET` |

The literal immediates are determined by the slot layout and instruction
position. In particular, `func_0032DCD0` intentionally loads slot 1 before slot
0, and `func_003D4668` requires writeback on the `+28` store. Reordering either
sequence is invalid even if final memory contents appear equivalent.

## Neutral metadata and validator requirements

Tracked metadata should contain only function name, exact function size, ordered
neutral identities, segment classes, and a closed form discriminator selecting
one template above. The private target builder must reject an entry unless:

1. the inventory reports ARM mode, the exact size in the table, and an aligned
   extent ending before every configured slot;
2. decoded instructions exactly match the selected deterministic template;
3. the first slot starts at the function end, every later slot is the next word,
   all slots are in bounds, and no slot overlaps an inventoried function;
4. every private word belongs to its declared half-open process-image segment;
5. identity equality is biconditional with private-word equality across this
   batch and all earlier neutral-identity mappings, including the two explicit
   reuses and the shared `multi_identity_03` / `multi_identity_04` pair; and
6. no scalar word is admitted merely because its numeric value lies inside a
   declared segment.

Each routine must occupy one dedicated executable `PROGBITS` section aligned to
four bytes. Section size is function size plus four bytes per slot. Its global
`FUNC` symbol starts at zero and ends at the stated function size, before the
slots. Every slot has exactly one `R_ARM_ABS32` relocation at its stated offset
against the configured global undefined zero-size `NOTYPE` identity; no addend
or extra relocation is allowed. The body begins with an ARM mapping symbol and
the slots with a data mapping symbol. The target builder must never emit a
private identity word.

The object validator must check section type, `A`/`X` flags, alignment and size;
function symbol binding, visibility, type, value and extent; mapping-symbol
transition; relocation count, offsets, type, ordering and exact symbol names;
undefined identity-symbol shape; exact cardinalities of nine functions, 220
function bytes, 19 relocation occurrences and 17 distinct identity labels (15
new plus two reused); and the expected two-use counts for
`multi_identity_03` and `multi_identity_04`.

## Exact textual-assembly probe

An ignored full textual A32 probe expressed all nine templates above and replaced
all 19 private words with neutral relocations. GNU assembler/readelf confirmed
the requested outside-extent layouts and relocation identities. Each assembled
function body was compared byte-for-byte with the independently observed private
target extent: all nine were exact, for 220 of 220 function bytes. A separate
objdiff 3.8.2 neutral-target probe of the two initially requested lookup routines
reported 100% for both `func_002C2244` and `func_004191B0`.
