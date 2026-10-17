# DllBattleHouseConnect analysis contract 01

## Provenance and clean-room boundary

This is a target-analysis specification for `cro/DllBattleHouseConnect` in
`AS_EUR_REV2`. It was prepared on 2026-10-17 from the externally supplied CRO
whose SHA-256 is the value already published for this unit in
`progress/units/AS_EUR_REV2.cro.json`. The repository baseline was
`4a07fbcd399281cd0006d8cf3c439e6bc50ec2bb`.

The analysis used the repository's `generate-cro-target-object.mjs` CRO parser,
Ghidra 11.3.2 with `ARM:LE:32:v6`, GNU Arm objdump/readelf 2.45.1 from Arm GNU
Toolchain 15.2.Rel1, and the public report, CSV inventory, and exact partition.
The observations below were independently restated as interface and operation
facts. This document contains no target bytes, encoded instructions,
disassembly transcript, Nintendo SDK content, extracted asset, target object,
private path, or private type-name string.

The implementation role may use this document and the public repository, but
must not consult the target CRO, private report products, or target
disassembly. Function names of the form `func_XXXXXXXX` are neutral names based
only on section-relative addresses.

## Whole-unit accounting

The module has these loadable sections:

| Section | Size | Alignment | Observed role |
| --- | ---: | ---: | --- |
| `.text` | 4,592 | 4 | 48 import veneers, 44 non-veneer code bodies, literal pools, one five-way control dispatcher, and its embedded tables |
| `.rodata` | 496 | 4 | member-dispatch descriptors, RTTI-like descriptors and private names, vtables, and state dispatch tables |
| `.data` | 4 | 4 | one zero-initialized writable pointer word |
| `.bss` | 76 | 4 | two writable state areas used by module initialization and control glue |

The CRO contains 129 `R_ARM_ABS32` relocations: 69 in `.text` and 60 in
`.rodata`. Of these, 58 address imports and 71 address local sections. There
are 54 distinct anonymous import identities. Forty-eight imports are reached
through consecutive eight-byte veneers at `.text+0x0000..0x017F`; each veneer
is a PC load into `pc` followed by its separately relocated word. The remaining
six import identities are data/type-descriptor dependencies in `.rodata`.

The 69 text relocations comprise the 48 veneer words, ten local `.rodata`
pointers, two local `.bss` pointers, eight local `.text` pointers (five in the
control jump table), and one `.data` pointer. The 60 rodata relocations comprise 48
local `.text` pointers, six local `.rodata` pointers, and six imports. An
implementation must preserve `R_ARM_ABS32`, not pre-resolve any relocated word.

Exact deferred import identities and their veneer mapping are intentionally
not reproduced here. They are unnecessary for the immediate zero-relocation
batch and remain unimplemented pending a separately reviewed clean-room
contract.

### High-confidence body boundaries

The following boundaries were recovered from relocated function pointers,
direct call targets, terminal returns/tail calls, and non-executable pool
edges. Pool bytes are excluded from sizes. The final control entry has split
code extents and therefore is deliberately not offered as an ordinary
single-section function claim.

| Address | Size | Address | Size | Address | Size |
| ---: | ---: | ---: | ---: | ---: | ---: |
| `0x0180` | 4 | `0x0184` | 52 | `0x01BC` | 48 |
| `0x01F0` | 8 | `0x01F8` | 476 | `0x03D8` | 8 |
| `0x03E0` | 272 | `0x04F0` | 152 | `0x0588` | 8 |
| `0x0590` | 12 | `0x059C` | 252 | `0x0698` | 8 |
| `0x06A0` | 4 | `0x06A4` | 8 | `0x06AC` | 20 |
| `0x06C0` | 4 | `0x06C4` | 240 | `0x07B4` | 312 |
| `0x08F0` | 4 | `0x08F4` | 104 | `0x095C` | 8 |
| `0x0964` | 12 | `0x0970` | 4 | `0x0974` | 92 |
| `0x09D0` | 212 | `0x0AA4` | 64 | `0x0AE4` | 204 |
| `0x0BB0` | 16 | `0x0BC0` | 520 | `0x0DD4` | 16 |
| `0x0DE4` | 184 | `0x0EA0` | 84 | `0x0EFC` | 80 |
| `0x0F54` | 8 | `0x0F5C` | 8 | `0x0F64` | 256 |
| `0x1064` | 4 | `0x1068` | 4 | `0x106C` | 12 |
| `0x1078` | 4 | `0x107C` | 12 | `0x1088` | 4 |
| `0x108C` | 124 |  |  |  |  |

The exported control entry begins at `0x1140`. Its executable extents are
`0x1140..0x1153` and `0x1168..0x11C7` (116 bytes total), separated by a
five-word jump table and followed by a ten-word literal/descriptor area. It is
not part of the immediate implementation batch below.

## Immediate implementation batch

The 17 functions in this section are independently implementable without any
literal pool, imported symbol, relocation, adjacent data, or private string,
and each boundary individually passes the repository's existing CRO function
semantics evidence gate. They total 672 bytes (168 ARM instructions). All use
ARM state, four-byte alignment, AAPCS register arguments, and no stack
arguments. The existing `func_00000F54` is included in that total and remains
unchanged.

| Function | Address | Size | Semantic tag |
| --- | ---: | ---: | --- |
| `func_000001F0` | `0x01F0` | 8 | return 13 |
| `func_000003D8` | `0x03D8` | 8 | return 14 |
| `func_00000588` | `0x0588` | 8 | return 11 |
| `func_00000590` | `0x0590` | 12 | set state byte to 15 |
| `func_0000059C` | `0x059C` | 252 | accept record update |
| `func_00000698` | `0x0698` | 8 | return 8 |
| `func_000006A4` | `0x06A4` | 8 | return 12 |
| `func_000006AC` | `0x06AC` | 20 | select status from flag |
| `func_0000095C` | `0x095C` | 8 | return 13 |
| `func_00000964` | `0x0964` | 12 | set ready byte |
| `func_00000BB0` | `0x0BB0` | 16 | virtual tail dispatch |
| `func_00000DD4` | `0x0DD4` | 16 | set flag and return 15 |
| `func_00000F54` | `0x0F54` | 8 | set background draw byte |
| `func_00000F5C` | `0x0F5C` | 8 | return 0 |
| `func_00000F64` | `0x0F64` | 256 | adjusted accept record update |
| `func_0000106C` | `0x106C` | 12 | set byte at 153 |
| `func_0000107C` | `0x107C` | 12 | set byte at 49 to 15 |

Nine proposed four-byte boundaries are excluded from the immediate batch
because, considered individually, they lack the structural-export or
direct-flow entry evidence required by that unchanged gate:
`func_00000180`, `func_000006A0`, `func_000006C0`, `func_000008F0`,
`func_00000970`, `func_00001064`, `func_00001068`, `func_00001078`, and
`func_00001088`. Their bytes remain deferred residue; this specification does
not weaken or bypass the shared evidence requirement.

### Exact scalar and dispatch schedules

- Each constant return loads the stated unsigned immediate into `r0` and then
  returns through `lr`; it does not touch flags or memory.
- `func_00000590(r0)`: load 15 into `r1`, store its low byte at `r0+85`, then
  return through `lr`.
- `func_000006AC(r0)`: load the unsigned byte at `r0+185`, compare it with
  zero, conditionally place 15 in `r0` when nonzero and 9 in `r0` when zero,
  then return. Both value writes are predicated; there is no branch.
- `func_00000964(r0)`: load 1 into `r1`, store its low byte at `r0+185`, then
  return.
- `func_00000BB0(r0)`: replace `r0` with the word at original `r0+92`, load
  that object's vtable word into `r2`, load the word at vtable offset 16 into
  `r2`, and tail-dispatch with `bx r2`. No null check and no link-register
  change are performed.
- `func_00000DD4(r0)`: load 1 into `r1`, store its low byte at `r0+84`, load
  15 into `r0`, and return.
- `func_00000F54(r0,r1)`: store the low byte of `r1` at `r0+217` and return.
- `func_0000106C(r0)`: load 1 into `r1`, store its low byte at `r0+153`, and
  return.
- `func_0000107C(r0)`: load 15 into `r1`, store its low byte at `r0+49`, and
  return.

### `func_0000059C`: complete operation schedule

Prototype-level contract: `void update(void *state, const void *record,
uint32_t record_size)`. The table is in physical instruction order. Positions
are relative to the function start and local labels name control-flow targets;
they are not encoded instruction words. `ip` denotes `r12`. Multiple-register
loads/stores use increment-after addressing without writeback unless shown.

| Position | Label | Mnemonic | Register/immediate operands | Branch target |
| ---: | --- | --- | --- | --- |
| `+0x00` |  | `push` | `{r4,r5,r6}` |  |
| `+0x04` |  | `cmp` | `r2, #16` |  |
| `+0x08` |  | `mov` | `r4, #0` |  |
| `+0x0C` |  | `mov` | `r3, #1` |  |
| `+0x10` |  | `beq` |  | `L_size16 (+0x5C)` |
| `+0x14` |  | `cmp` | `r2, #8` |  |
| `+0x18` |  | `bne` |  | `L_done (+0x54)` |
| `+0x1C` |  | `ldr` | `r2, [r1,#0]` |  |
| `+0x20` |  | `ldr` | `r1, [r1,#4]` |  |
| `+0x24` |  | `ldr` | `ip, [r0,#192]` |  |
| `+0x28` |  | `ldr` | `r5, [r0,#196]` |  |
| `+0x2C` |  | `eor` | `ip, ip, r2` |  |
| `+0x30` |  | `eor` | `r5, r5, r1` |  |
| `+0x34` |  | `orrs` | `ip, ip, r5` |  |
| `+0x38` |  | `beq` |  | `L_done (+0x54)` |
| `+0x3C` |  | `ldr` | `ip, [r0,#244]` |  |
| `+0x40` |  | `add` | `ip, r0, ip, lsl #3` |  |
| `+0x44` |  | `str` | `r2, [ip,#200]!` |  |
| `+0x48` |  | `str` | `r1, [ip,#4]` |  |
| `+0x4C` |  | `strb` | `r3, [r0,#184]` |  |
| `+0x50` |  | `strb` | `r4, [r0,#248]` |  |
| `+0x54` | `L_done` | `pop` | `{r4,r5,r6}` |  |
| `+0x58` |  | `bx` | `lr` |  |
| `+0x5C` | `L_size16` | `ldmia` | `r1, {r2,ip}` |  |
| `+0x60` |  | `ldr` | `r6, [r0,#192]` |  |
| `+0x64` |  | `ldr` | `r5, [r0,#196]` |  |
| `+0x68` |  | `eor` | `r6, r6, r2` |  |
| `+0x6C` |  | `eor` | `r5, r5, ip` |  |
| `+0x70` |  | `orrs` | `r5, r5, r6` |  |
| `+0x74` |  | `beq` |  | `L_done (+0x54)` |
| `+0x78` |  | `ldr` | `r5, [r0,#64]` |  |
| `+0x7C` |  | `ldrb` | `r6, [r5,#32]` |  |
| `+0x80` |  | `cmp` | `r6, #1` |  |
| `+0x84` |  | `bne` |  | `L_append (+0xAC)` |
| `+0x88` |  | `ldrb` | `r5, [r5,#20]` |  |
| `+0x8C` |  | `cmp` | `r5, #0` |  |
| `+0x90` |  | `ldr` | `r5, [r1,#12]` |  |
| `+0x94` |  | `beq` |  | `L_mode0 (+0xA4)` |
| `+0x98` |  | `cmp` | `r5, #1` |  |
| `+0x9C` |  | `beq` |  | `L_special (+0xEC)` |
| `+0xA0` |  | `b` |  | `L_append (+0xAC)` |
| `+0xA4` | `L_mode0` | `cmp` | `r5, #0` |  |
| `+0xA8` |  | `beq` |  | `L_special (+0xEC)` |
| `+0xAC` | `L_append` | `ldr` | `r5, [r0,#244]` |  |
| `+0xB0` |  | `add` | `r5, r0, r5, lsl #3` |  |
| `+0xB4` |  | `add` | `r5, r5, #200` |  |
| `+0xB8` |  | `stmia` | `r5, {r2,ip}` |  |
| `+0xBC` |  | `strb` | `r3, [r0,#184]` |  |
| `+0xC0` |  | `strb` | `r4, [r0,#248]` |  |
| `+0xC4` |  | `ldr` | `r0, [r0,#64]` |  |
| `+0xC8` |  | `ldrb` | `r2, [r0,#32]` |  |
| `+0xCC` |  | `cmp` | `r2, #1` |  |
| `+0xD0` |  | `ldrbeq` | `r2, [r0,#20]` |  |
| `+0xD4` |  | `cmpeq` | `r2, #0` |  |
| `+0xD8` |  | `ldreq` | `r1, [r1,#8]` |  |
| `+0xDC` |  | `streq` | `r1, [r0,#28]` |  |
| `+0xE0` |  | `bne` |  | `L_done (+0x54)` |
| `+0xE4` |  | `pop` | `{r4,r5,r6}` |  |
| `+0xE8` |  | `bx` | `lr` |  |
| `+0xEC` | `L_special` | `strb` | `r3, [r0,#248]` |  |
| `+0xF0` |  | `strb` | `r3, [r0,#184]` |  |
| `+0xF4` |  | `pop` | `{r4,r5,r6}` |  |
| `+0xF8` |  | `bx` | `lr` |  |

### `func_00000F64`: complete operation schedule

This routine has the same prototype, but incoming `r0` points 32 bytes into
the state object. Positions and labels follow the same neutral convention as
the preceding table.

| Position | Label | Mnemonic | Register/immediate operands | Branch target |
| ---: | --- | --- | --- | --- |
| `+0x00` |  | `push` | `{r4,r5,r6}` |  |
| `+0x04` |  | `cmp` | `r2, #16` |  |
| `+0x08` |  | `sub` | `r0, r0, #32` |  |
| `+0x0C` |  | `mov` | `r4, #0` |  |
| `+0x10` |  | `mov` | `r3, #1` |  |
| `+0x14` |  | `beq` |  | `L_size16 (+0x60)` |
| `+0x18` |  | `cmp` | `r2, #8` |  |
| `+0x1C` |  | `bne` |  | `L_done (+0x58)` |
| `+0x20` |  | `ldr` | `r2, [r1,#0]` |  |
| `+0x24` |  | `ldr` | `r1, [r1,#4]` |  |
| `+0x28` |  | `ldr` | `ip, [r0,#192]` |  |
| `+0x2C` |  | `ldr` | `r5, [r0,#196]` |  |
| `+0x30` |  | `eor` | `ip, ip, r2` |  |
| `+0x34` |  | `eor` | `r5, r5, r1` |  |
| `+0x38` |  | `orrs` | `ip, ip, r5` |  |
| `+0x3C` |  | `beq` |  | `L_done (+0x58)` |
| `+0x40` |  | `ldr` | `ip, [r0,#244]` |  |
| `+0x44` |  | `add` | `ip, r0, ip, lsl #3` |  |
| `+0x48` |  | `str` | `r2, [ip,#200]!` |  |
| `+0x4C` |  | `str` | `r1, [ip,#4]` |  |
| `+0x50` |  | `strb` | `r3, [r0,#184]` |  |
| `+0x54` |  | `strb` | `r4, [r0,#248]` |  |
| `+0x58` | `L_done` | `pop` | `{r4,r5,r6}` |  |
| `+0x5C` |  | `bx` | `lr` |  |
| `+0x60` | `L_size16` | `add` | `r5, r0, #192` |  |
| `+0x64` |  | `ldmia` | `r1, {r2,ip}` |  |
| `+0x68` |  | `ldmia` | `r5, {r5,r6}` |  |
| `+0x6C` |  | `eor` | `r5, r5, r2` |  |
| `+0x70` |  | `eor` | `r6, r6, ip` |  |
| `+0x74` |  | `orrs` | `r5, r5, r6` |  |
| `+0x78` |  | `beq` |  | `L_done (+0x58)` |
| `+0x7C` |  | `ldr` | `r5, [r0,#64]` |  |
| `+0x80` |  | `ldrb` | `r6, [r5,#32]` |  |
| `+0x84` |  | `cmp` | `r6, #1` |  |
| `+0x88` |  | `bne` |  | `L_append (+0xB0)` |
| `+0x8C` |  | `ldrb` | `r5, [r5,#20]` |  |
| `+0x90` |  | `cmp` | `r5, #0` |  |
| `+0x94` |  | `ldr` | `r5, [r1,#12]` |  |
| `+0x98` |  | `beq` |  | `L_mode0 (+0xA8)` |
| `+0x9C` |  | `cmp` | `r5, #1` |  |
| `+0xA0` |  | `beq` |  | `L_special (+0xF0)` |
| `+0xA4` |  | `b` |  | `L_append (+0xB0)` |
| `+0xA8` | `L_mode0` | `cmp` | `r5, #0` |  |
| `+0xAC` |  | `beq` |  | `L_special (+0xF0)` |
| `+0xB0` | `L_append` | `ldr` | `r5, [r0,#244]` |  |
| `+0xB4` |  | `add` | `r5, r0, r5, lsl #3` |  |
| `+0xB8` |  | `add` | `r5, r5, #200` |  |
| `+0xBC` |  | `stmia` | `r5, {r2,ip}` |  |
| `+0xC0` |  | `strb` | `r3, [r0,#184]` |  |
| `+0xC4` |  | `strb` | `r4, [r0,#248]` |  |
| `+0xC8` |  | `ldr` | `r0, [r0,#64]` |  |
| `+0xCC` |  | `ldrb` | `r2, [r0,#32]` |  |
| `+0xD0` |  | `cmp` | `r2, #1` |  |
| `+0xD4` |  | `ldrbeq` | `r2, [r0,#20]` |  |
| `+0xD8` |  | `cmpeq` | `r2, #0` |  |
| `+0xDC` |  | `ldreq` | `r1, [r1,#8]` |  |
| `+0xE0` |  | `streq` | `r1, [r0,#28]` |  |
| `+0xE4` |  | `bne` |  | `L_done (+0x58)` |
| `+0xE8` |  | `pop` | `{r4,r5,r6}` |  |
| `+0xEC` |  | `bx` | `lr` |  |
| `+0xF0` | `L_special` | `strb` | `r3, [r0,#248]` |  |
| `+0xF4` |  | `strb` | `r3, [r0,#184]` |  |
| `+0xF8` |  | `pop` | `{r4,r5,r6}` |  |
| `+0xFC` |  | `bx` | `lr` |  |

Neither update routine reads bytes 8..15 for an eight-byte record. For a
16-byte record, word `+8` is read only by the conditional metadata-copy path
and word `+12` only by the mode-selection test. Both routines have no calls
and restore `r4-r6` without saving or modifying `lr`.

## Deferred code groups

The following code is confidently bounded but is not in the immediate batch
because exact implementation requires imported calls, local data identities,
literal pools, or a larger state-machine contract:

- `0x0184` and `0x01BC`: two destructor forms. Both install the same local
  vtable identity, conditionally release the pointer at object offset 20 via
  veneer `0x0000`, clear that slot, and differ in final destruction dispatch.
- `0x01F8`, `0x03E0`, `0x04F0`, `0x06C4`, `0x07B4`, `0x08F4`, `0x0974`,
  `0x09D0`, `0x0AA4`, `0x0AE4`, and `0x0BC0`: connection state-machine
  operations using anonymous import veneers, virtual calls, and local
  dispatch/member tables.
- `0x0DE4`, `0x0EA0`, and `0x0EFC`: constructor/destructor variants that
  install local vtables and initialize or release object state.
- `0x108C`: module initializer that writes scalar floating-point configuration
  values into two BSS regions. Its body is 124 bytes and is followed by 48
  bytes of non-relocated scalar literals plus eight bytes containing local BSS
  relocations.
- `0x1140`: exported five-way module control dispatcher with an embedded jump
  table and descriptor words.

## Neutral data description and full-link blocker

`.rodata+0x000..0x07F` is sixteen two-word member-dispatch descriptors. Each
record contains a relocated local code pointer and a zero adjustment word.
The code targets are exactly the sixteen state handlers whose addresses are
represented in the high-confidence boundary table. `.rodata+0x080..0x0BF`
contains four RTTI-like descriptor records with six imported relocations and
six local-rodata relocations. `.rodata+0x0C0..0x15F` contains three private
NUL-terminated type-name strings followed by alignment/filler. The strings are
not reproduced here. `.rodata+0x160..0x1EF` contains vtables and two additional
state-dispatch tables, with local text/rodata relocations and two imported
function relocations. `.data` is one zero word. `.bss+0x00..0x3B` and
`.bss+0x3C..0x4B` are separate initializer-owned writable scalar blocks.

Full byte-identical linkage is not presently lawful from the available public
evidence. The exact three type-name strings and the exact descriptor/vtable
table payload are target-derived copyrighted data, and the project rules
forbid copying strings or tables from the binary into Git. No public,
independent source for those spellings and table identities was found. This is
a concrete clean-room blocker for all 496 rodata bytes and, transitively, for
code pools that relocate to those data identities. A future implementation
may proceed only if the coordinator supplies a lawful independent interface
source for those names/tables or explicitly scopes a reproducible generated
representation whose provenance satisfies `docs/CLEAN_ROOM.md`.

Remaining residue after the immediate 672-byte batch is explicit. The public
partition classifies the remaining 3,920 text bytes as:

- 3,440 executable gap bytes: 3,248 deferred body bytes plus 192 veneer
  instruction bytes forming 48 anonymous-import veneers;
- 308 pool bytes; and
- 172 unknown bytes: the unclaimed 124-byte initializer body plus 48 scalar
  literal bytes.

The non-text residue remains:

- 496 rodata bytes, 4 data bytes, and 76 bss bytes; and
- all 129 relocations until corresponding code/data ownership is integrated.

The public report's `metadata.complete` must remain `false`. Matching the 17
functions in the immediate batch would be valuable code progress but would not
account for unit data, veneers, relocations, control glue, or unknown residue.
