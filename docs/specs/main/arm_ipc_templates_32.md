# Probe-verified ARM IPC/service wrappers 32

## Scope and provenance

- Target: `AS_EUR_REV2`, independently verified in `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the current objdiff unmatched report, bounded private-target
  control/data-flow inspection, physical literal identity comparison, and an
  independent GNU Arm exact-schedule probe.
- Probe toolchain: GNU Arm assembler, objcopy, objdump, and readelf
  2.45.1.20251203 from GCC Arm Embedded 15.2.Rel1.
- Clean-room role: analysis/specification only. No target bytes, instruction
  encodings, private addresses, private literal values, implementation, game
  assets, or proprietary source are present.

This batch covers eleven still-unmatched ARM-state dual-backend IPC dispatch
wrappers totaling exactly 808 executable bytes. Every wrapper tests the same
primary service-handle slot, dispatches to its primary IPC operation when that
slot is nonzero, otherwise tests the same secondary service-handle slot and
dispatches to its secondary IPC operation. If neither backend is available,
all eleven wrappers return the same symbolic unavailable-status identity.

The batch is disjoint from duplicate batch 36 (`func_00183AAC`,
`func_0018A0BC`, and `func_00568108`) and runtime batch 35
(`func_00300EA8`, `func_00301FBC`, `func_003028B8`, `func_00303150`,
`func_003032D0`, `func_00305760`, `func_0030E318`, and `func_0030FDE8`).

## Function, pool, and call inventory

All functions and all 22 external destinations are ARM mode and 4-byte
aligned primary function entries. The primary operation always precedes the
secondary operation in the transfer column. Each function has exactly three
ordered pool slots: `ipc_handle_slot_theta`, `ipc_handle_slot_eta`, then
`ipc_unavailable_status_32`.

| Function | Size | Pool offsets | Ordered external transfers | Visible behavior |
| --- | ---: | --- | --- | --- |
| `func_001FF27C` | 92 | +0x5c, +0x60, +0x64 | `func_001FFCB8`, `func_001FF5F0` | Preserve three entry-stack words in a 16-byte outgoing area and dispatch. |
| `func_001FF320` | 92 | +0x5c, +0x60, +0x64 | `func_001FFD74`, `func_001FF6AC` | Preserve two entry-stack words in a 12-byte outgoing area and dispatch. |
| `func_001FF388` | 92 | +0x5c, +0x60, +0x64 | `func_001FFDE4`, `func_001FF71C` | Same stack-forwarding shape as `func_001FF320`, with distinct operations. |
| `func_001FF3F0` | 64 | +0x40, +0x44, +0x48 | `func_001FFE54`, conditional `func_001FF78C` | Forward one entry-stack word and dispatch. |
| `func_001FF460` | 104 | +0x68, +0x6c, +0x70 | `func_001FFEAC`, `func_001FF7E4` | Preserve four entry-stack words in a 20-byte outgoing area and dispatch. |
| `func_001FF54C` | 92 | +0x5c, +0x60, +0x64 | `func_001FFF40`, `func_001FF878` | Preserve three entry-stack words in a 16-byte outgoing area and dispatch. |
| `func_001FFBC8` | 48 | +0x30, +0x34, +0x38 | tail `func_0020004C`, tail `func_001FF984` | Register-only tail dispatch. |
| `func_001FFC7C` | 48 | +0x30, +0x34, +0x38 | tail `func_0020010C`, tail `func_001FFA44` | Register-only tail dispatch. |
| `func_00200254` | 64 | +0x40, +0x44, +0x48 | `func_00200154`, conditional `func_001FFA8C` | Forward one entry-stack word and dispatch. |
| `func_002002A0` | 48 | +0x30, +0x34, +0x38 | tail `func_002001B0`, tail `func_001FFAE8` | Register-only tail dispatch. |
| `func_002002DC` | 64 | +0x40, +0x44, +0x48 | `func_002001F8`, conditional `func_001FFB30` | Forward one entry-stack word and dispatch. |

## Complete normative mnemonic schedules

The schedules are complete and literal. `BEGIN` emits only the standard ARM
section/function header. `EP3` ends the executable body before emitting the
three ordered symbolic pool entries. Labels and directives occupy no
executable bytes. Preserve every mnemonic, operand, register, condition,
branch shape, stack operation, shared epilogue placement, and pool order.

```asm
.syntax unified
.arch armv6k
.arm
.macro BEGIN f
 .section .text.\f,"ax",%progbits;.balign 4;.arm;.global \f;.type \f,%function
\f:
.endm
.macro EP3 f,p0,p1,p2
 .size \f,.-\f;.Lpool_\f:.word \p0;.word \p1;.word \p2
.endm

.global ipc_handle_slot_theta,ipc_handle_slot_eta,ipc_unavailable_status_32
.global func_001FFCB8,func_001FF5F0,func_001FFD74,func_001FF6AC
.global func_001FFDE4,func_001FF71C,func_001FFE54,func_001FF78C
.global func_001FFEAC,func_001FF7E4,func_001FFF40,func_001FF878
.global func_0020004C,func_001FF984,func_0020010C,func_001FFA44
.global func_00200154,func_001FFA8C,func_002001B0,func_001FFAE8
.global func_002001F8,func_001FFB30

BEGIN func_001FF27C
push {r4,r5,r6,lr};sub sp,sp,#16;ldr r6,.Lpool_func_001FF27C
ldr r12,[sp,#32];ldrd r4,[sp,#36];ldr r6,[r6];cmp r6,#0
beq .Lsecondary_001FF27C;str r12,[sp];strd r4,[sp,#4];bl func_001FFCB8
.Lreturn_001FF27C:add sp,sp,#16;pop {r4,r5,r6,pc}
.Lsecondary_001FF27C:ldr r6,.Lpool_func_001FF27C+4;ldr r6,[r6];cmp r6,#0
ldreq r0,.Lpool_func_001FF27C+8;beq .Lreturn_001FF27C
str r12,[sp];strd r4,[sp,#4];bl func_001FF5F0
add sp,sp,#16;pop {r4,r5,r6,pc}
EP3 func_001FF27C,ipc_handle_slot_theta,ipc_handle_slot_eta,ipc_unavailable_status_32

BEGIN func_001FF320
push {r4,r5,lr};sub sp,sp,#12;ldr r5,.Lpool_func_001FF320
ldr r4,[sp,#28];ldr r12,[sp,#24];ldr r5,[r5];cmp r5,#0
beq .Lsecondary_001FF320;str r4,[sp,#4];str r12,[sp];bl func_001FFD74
.Lreturn_001FF320:add sp,sp,#12;pop {r4,r5,pc}
.Lsecondary_001FF320:ldr r5,.Lpool_func_001FF320+4;ldr r5,[r5];cmp r5,#0
ldreq r0,.Lpool_func_001FF320+8;beq .Lreturn_001FF320
str r4,[sp,#4];str r12,[sp];bl func_001FF6AC
add sp,sp,#12;pop {r4,r5,pc}
EP3 func_001FF320,ipc_handle_slot_theta,ipc_handle_slot_eta,ipc_unavailable_status_32

BEGIN func_001FF388
push {r4,r5,lr};sub sp,sp,#12;ldr r5,.Lpool_func_001FF388
ldr r4,[sp,#28];ldr r12,[sp,#24];ldr r5,[r5];cmp r5,#0
beq .Lsecondary_001FF388;str r4,[sp,#4];str r12,[sp];bl func_001FFDE4
.Lreturn_001FF388:add sp,sp,#12;pop {r4,r5,pc}
.Lsecondary_001FF388:ldr r5,.Lpool_func_001FF388+4;ldr r5,[r5];cmp r5,#0
ldreq r0,.Lpool_func_001FF388+8;beq .Lreturn_001FF388
str r4,[sp,#4];str r12,[sp];bl func_001FF71C
add sp,sp,#12;pop {r4,r5,pc}
EP3 func_001FF388,ipc_handle_slot_theta,ipc_handle_slot_eta,ipc_unavailable_status_32

BEGIN func_001FF3F0
push {r3,r4,r5,lr};ldr r4,.Lpool_func_001FF3F0;ldr r12,[sp,#16]
ldr r4,[r4];cmp r4,#0;beq .Lsecondary_001FF3F0
str r12,[sp];bl func_001FFE54;pop {r3,r4,r5,pc}
.Lsecondary_001FF3F0:ldr r4,.Lpool_func_001FF3F0+4;ldr r4,[r4];cmp r4,#0
ldreq r0,.Lpool_func_001FF3F0+8;strne r12,[sp];blne func_001FF78C
pop {r3,r4,r5,pc}
EP3 func_001FF3F0,ipc_handle_slot_theta,ipc_handle_slot_eta,ipc_unavailable_status_32

BEGIN func_001FF460
push {r4,r5,r6,r7,lr};sub sp,sp,#20;add r7,sp,#44
ldr r12,[sp,#40];ldm r7,{r4,r5,r6};ldr r7,.Lpool_func_001FF460
ldr r7,[r7];cmp r7,#0;beq .Lsecondary_001FF460
add r7,sp,#4;str r12,[sp];stm r7,{r4,r5,r6};bl func_001FFEAC
.Lreturn_001FF460:add sp,sp,#20;pop {r4,r5,r6,r7,pc}
.Lsecondary_001FF460:ldr r7,.Lpool_func_001FF460+4;ldr r7,[r7];cmp r7,#0
ldreq r0,.Lpool_func_001FF460+8;beq .Lreturn_001FF460
add r7,sp,#4;str r12,[sp];stm r7,{r4,r5,r6};bl func_001FF7E4
add sp,sp,#20;pop {r4,r5,r6,r7,pc}
EP3 func_001FF460,ipc_handle_slot_theta,ipc_handle_slot_eta,ipc_unavailable_status_32

BEGIN func_001FF54C
push {r4,r5,r6,lr};sub sp,sp,#16;ldr r6,.Lpool_func_001FF54C
ldr r12,[sp,#32];ldrd r4,[sp,#36];ldr r6,[r6];cmp r6,#0
beq .Lsecondary_001FF54C;str r12,[sp];strd r4,[sp,#4];bl func_001FFF40
.Lreturn_001FF54C:add sp,sp,#16;pop {r4,r5,r6,pc}
.Lsecondary_001FF54C:ldr r6,.Lpool_func_001FF54C+4;ldr r6,[r6];cmp r6,#0
ldreq r0,.Lpool_func_001FF54C+8;beq .Lreturn_001FF54C
str r12,[sp];strd r4,[sp,#4];bl func_001FF878
add sp,sp,#16;pop {r4,r5,r6,pc}
EP3 func_001FF54C,ipc_handle_slot_theta,ipc_handle_slot_eta,ipc_unavailable_status_32

BEGIN func_001FFBC8
ldr r3,.Lpool_func_001FFBC8;ldr r3,[r3];cmp r3,#0;beq .Lsecondary_001FFBC8
b func_0020004C
.Lsecondary_001FFBC8:ldr r3,.Lpool_func_001FFBC8+4;ldr r3,[r3];cmp r3,#0
ldreq r0,.Lpool_func_001FFBC8+8;beq .Lreturn_001FFBC8;b func_001FF984
.Lreturn_001FFBC8:bx lr
EP3 func_001FFBC8,ipc_handle_slot_theta,ipc_handle_slot_eta,ipc_unavailable_status_32

BEGIN func_001FFC7C
ldr r2,.Lpool_func_001FFC7C;ldr r2,[r2];cmp r2,#0;beq .Lsecondary_001FFC7C
b func_0020010C
.Lsecondary_001FFC7C:ldr r2,.Lpool_func_001FFC7C+4;ldr r2,[r2];cmp r2,#0
ldreq r0,.Lpool_func_001FFC7C+8;beq .Lreturn_001FFC7C;b func_001FFA44
.Lreturn_001FFC7C:bx lr
EP3 func_001FFC7C,ipc_handle_slot_theta,ipc_handle_slot_eta,ipc_unavailable_status_32

BEGIN func_00200254
push {r3,r4,r5,lr};ldr r4,.Lpool_func_00200254;ldr r12,[sp,#16]
ldr r4,[r4];cmp r4,#0;beq .Lsecondary_00200254
str r12,[sp];bl func_00200154;pop {r3,r4,r5,pc}
.Lsecondary_00200254:ldr r4,.Lpool_func_00200254+4;ldr r4,[r4];cmp r4,#0
ldreq r0,.Lpool_func_00200254+8;strne r12,[sp];blne func_001FFA8C
pop {r3,r4,r5,pc}
EP3 func_00200254,ipc_handle_slot_theta,ipc_handle_slot_eta,ipc_unavailable_status_32

BEGIN func_002002A0
ldr r12,.Lpool_func_002002A0;ldr r12,[r12];cmp r12,#0;beq .Lsecondary_002002A0
b func_002001B0
.Lsecondary_002002A0:ldr r12,.Lpool_func_002002A0+4;ldr r12,[r12];cmp r12,#0
ldreq r0,.Lpool_func_002002A0+8;beq .Lreturn_002002A0;b func_001FFAE8
.Lreturn_002002A0:bx lr
EP3 func_002002A0,ipc_handle_slot_theta,ipc_handle_slot_eta,ipc_unavailable_status_32

BEGIN func_002002DC
push {r3,r4,r5,lr};ldr r4,.Lpool_func_002002DC;ldr r12,[sp,#16]
ldr r4,[r4];cmp r4,#0;beq .Lsecondary_002002DC
str r12,[sp];bl func_002001F8;pop {r3,r4,r5,pc}
.Lsecondary_002002DC:ldr r4,.Lpool_func_002002DC+4;ldr r4,[r4];cmp r4,#0
ldreq r0,.Lpool_func_002002DC+8;strne r12,[sp];blne func_001FFB30
pop {r3,r4,r5,pc}
EP3 func_002002DC,ipc_handle_slot_theta,ipc_handle_slot_eta,ipc_unavailable_status_32
```

## Equality and relocation ledger

There are exactly 22 external ARM branch sites: 13 `R_ARM_CALL` sites and
nine `R_ARM_JUMP24` sites. The three conditional linked transfers are
`R_ARM_JUMP24`; the six unconditional tail transfers are also
`R_ARM_JUMP24`. Local conditional branches are not relocations.

| Function | Branch sites `(offset, relocation, mnemonic, identity)` |
| --- | --- |
| `func_001FF27C` | (+0x28, CALL, `bl`, `func_001FFCB8`); (+0x50, CALL, `bl`, `func_001FF5F0`) |
| `func_001FF320` | (+0x28, CALL, `bl`, `func_001FFD74`); (+0x50, CALL, `bl`, `func_001FF6AC`) |
| `func_001FF388` | (+0x28, CALL, `bl`, `func_001FFDE4`); (+0x50, CALL, `bl`, `func_001FF71C`) |
| `func_001FF3F0` | (+0x1c, CALL, `bl`, `func_001FFE54`); (+0x38, JUMP24, `blne`, `func_001FF78C`) |
| `func_001FF460` | (+0x30, CALL, `bl`, `func_001FFEAC`); (+0x5c, CALL, `bl`, `func_001FF7E4`) |
| `func_001FF54C` | (+0x28, CALL, `bl`, `func_001FFF40`); (+0x50, CALL, `bl`, `func_001FF878`) |
| `func_001FFBC8` | (+0x10, JUMP24, `b`, `func_0020004C`); (+0x28, JUMP24, `b`, `func_001FF984`) |
| `func_001FFC7C` | (+0x10, JUMP24, `b`, `func_0020010C`); (+0x28, JUMP24, `b`, `func_001FFA44`) |
| `func_00200254` | (+0x1c, CALL, `bl`, `func_00200154`); (+0x38, JUMP24, `blne`, `func_001FFA8C`) |
| `func_002002A0` | (+0x10, JUMP24, `b`, `func_002001B0`); (+0x28, JUMP24, `b`, `func_001FFAE8`) |
| `func_002002DC` | (+0x1c, CALL, `bl`, `func_002001F8`); (+0x38, JUMP24, `blne`, `func_001FFB30`) |

Target-side entry re-audit proves that all 22 destinations are distinct
primary ARM function starts. Thus the branch identity contract contains 22
singleton equality classes, all pairwise distinct. There are no shared branch
destinations, secondary entries, BLX transfers, interworking veneers, or
indirect calls in this batch.

There are exactly 33 ordered `R_ARM_ABS32` pool slots in three equality
classes:

| Identity | Sites | Equality contract |
| --- | --- | --- |
| `ipc_handle_slot_theta` | first pool slot of all eleven functions | all eleven equal; reuses the existing cumulative IPC identity |
| `ipc_handle_slot_eta` | second pool slot of all eleven functions | all eleven equal; reuses the existing cumulative IPC identity |
| `ipc_unavailable_status_32` | third pool slot of all eleven functions | all eleven equal; new class, unequal to every prior IPC literal class |

Physical comparison proves that the first and second classes are distinct,
that their ordering is invariant in every wrapper, and that the third class is
distinct from both. Adding these 33 slots and one new class to batches 12, 13,
and 15 through 31 yields exactly **507 ordered pool slots in 238 equality
classes**. Pool words are symbolic only; their private values are neither
required nor permitted in an implementation.

## Exact-probe evidence

The independent probe assembled the complete schedules above as eleven
separate aligned ARM sections. `readelf` reported exactly 55 relocations: 13
`R_ARM_CALL`, nine `R_ARM_JUMP24`, and 33 `R_ARM_ABS32`, with precisely the
offsets, symbols, conditions, and pool order in the ledgers above. Every
section measured `body size + 12` bytes, proving that each pool begins exactly
at the declared body boundary and contains exactly three words.

For every function, the probe section was compared with the bounded private
target extent after normalizing only the two externally relocated branch
words and excluding the three symbolic pool words. All remaining body bytes,
including local branch displacements and both duplicated/shared epilogue
placements, were exactly equal:

| Function | Exact body bytes |
| --- | ---: |
| `func_001FF27C` | 92 |
| `func_001FF320` | 92 |
| `func_001FF388` | 92 |
| `func_001FF3F0` | 64 |
| `func_001FF460` | 104 |
| `func_001FF54C` | 92 |
| `func_001FFBC8` | 48 |
| `func_001FFC7C` | 48 |
| `func_00200254` | 64 |
| `func_002002A0` | 48 |
| `func_002002DC` | 64 |
| **Total** | **808** |

The two normalized external branch words in every function were independently
decoded from the target and resolved to the same ordered ARM identities shown
above. Direct target pool comparison independently established the 11/11/11
literal equality partition and the two cumulative-identity reuses. The current
objdiff report identifies all eleven bodies as unmatched before this batch.

## Implementation constraints

- Implement exactly the eleven schedules above in one ARM assembly unit.
- Preserve function order, body sizes, local branch destinations, shared
  epilogues, stack offsets, conditions, and the ordered three-word pool after
  every body.
- Reuse the established symbolic identities `ipc_handle_slot_theta` and
  `ipc_handle_slot_eta`; introduce only `ipc_unavailable_status_32`.
- Keep every external transfer as the specified `bl`, `blne`, or `b` to its
  exact singleton identity. Do not merge same-shaped IPC operations.
- Do not materialize private literal values, raw instruction encodings, or
  anonymous data words.
