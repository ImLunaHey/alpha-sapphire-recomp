# Probe-verified ARM service/IPC wrappers 33

## Scope and provenance

- Target: `AS_EUR_REV2`, independently verified in `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the current objdiff unmatched report, bounded private-target
  control/data-flow inspection, physical literal identity comparison, and an
  independent GNU Arm exact-schedule probe.
- Probe toolchain: GNU Arm assembler, objcopy, objdump, and readelf
  2.45.1.20251203 from Arm GNU Toolchain 15.2.Rel1.
- Clean-room role: analysis/specification only. No target bytes, instruction
  encodings, private addresses, private literal values, implementation, game
  assets, or proprietary source are present.

This batch covers eight still-unmatched ARM-state service/IPC wrappers totaling
exactly 524 executable bytes. All eight issue the same previously specified IPC
transfer and conditionally call the same failure operation after extracting the
status sign bit. They expose two-byte, structured, scalar, and normalized flag
results. One wrapper additionally performs a locked service operation and
compares its IPC result against two bytes in shared service state.

The batch is disjoint from duplicate batch 37 (`func_00557CAC`,
`func_00558928`, and `func_00559478`) and runtime batch 36
(`func_002F39D4`, `func_002F3ED8`, `func_002F9230`, `func_002FF24C`, and
`func_0030F584`).

## Function, pool, and behavior inventory

All functions and external destinations are ARM mode, four-byte aligned primary
function entries. Pool offsets are relative to the executable body.

| Function | Size | Ordered pool slots | Visible behavior |
| --- | ---: | --- | --- |
| `func_002009A4` | 68 | `service_seed_halfword_33` at +0x44; `service_request_kind_33` at +0x48 | Initialize a two-byte buffer from the seed halfword, transfer it with the symbolic request kind, then copy both returned bytes to entry `r0`. |
| `func_002009F0` | 56 | none | Transfer 28 bytes into a stack buffer and copy its first 24 bytes to entry `r0`. |
| `func_00200A28` | 116 | `service_lock_object_33` at +0x74; `service_operation_object_33` at +0x78; `service_result_object_33` at +0x7c | Transfer a halfword, run a locked service operation, and return whether the transferred halfword is unsigned-greater-than-or-equal to the little-endian threshold in result-state bytes 44 and 45. Return zero if the operation status is negative. |
| `func_00200ABC` | 56 | none | Transfer 192 bytes and return word-zero bit 5 normalized to zero or one. |
| `func_00200B2C` | 60 | none | Zero an eight-byte buffer, transfer eight bytes, and return the full value in `r0:r1`. |
| `func_00200B68` | 56 | none | Transfer 192 bytes and return word-zero bit 6 normalized to zero or one. |
| `func_00200BA0` | 56 | none | Transfer 192 bytes and return word-zero bit 4 normalized to zero or one. |
| `func_00200BD8` | 56 | none | Transfer 192 bytes and return word-zero bit 3 normalized to zero or one. |

## Complete normative mnemonic schedules

The schedules are complete and literal. `BEGIN` emits only the standard ARM
section/function header. `END` terminates the executable body before any
ordered symbolic pool words. Labels and directives occupy no executable bytes.
Preserve every mnemonic, operand, register, condition, stack operation, local
branch destination, and pool order.

```asm
.syntax unified
.arch armv6k
.arm

.macro BEGIN f
 .section .text.\f,"ax",%progbits
 .balign 4
 .arm
 .global \f
 .type \f,%function
\f:
.endm

.macro END f
 .size \f,.-\f
.endm

.global func_00124880,func_00124FB0
.global func_001602B8,func_00160380,func_001F4A1C
.global service_seed_halfword_33,service_request_kind_33
.global service_lock_object_33
.global service_operation_object_33
.global service_result_object_33

BEGIN func_002009A4
push {r3,r4,r5,lr}
mov r4,r0
ldr r0,.Lpool_002009A4
ldr r2,.Lpool_002009A4+4
mov r1,#2
ldrh r0,[r0]
strh r0,[sp]
mov r0,sp
bl func_00124880
mov r1,pc
lsrs r2,r0,#31
blne func_00124FB0
ldrb r0,[sp]
strb r0,[r4]
ldrb r0,[sp,#1]
strb r0,[r4,#1]
pop {r3,r4,r5,pc}
END func_002009A4
.Lpool_002009A4:
.word service_seed_halfword_33
.word service_request_kind_33

BEGIN func_002009F0
push {r4,r5,lr}
sub sp,sp,#28
mov r4,r0
mov r2,#0xa0000
mov r1,#28
mov r0,sp
bl func_00124880
mov r1,pc
lsrs r2,r0,#31
blne func_00124FB0
ldm sp,{r0,r1,r2,r3,r5,r12}
stm r4,{r0,r1,r2,r3,r5,r12}
add sp,sp,#28
pop {r4,r5,pc}
END func_002009F0

BEGIN func_00200A28
push {r3,r4,r5,lr}
mov r2,#0xd0000
mov r1,#4
mov r0,sp
bl func_00124880
mov r1,pc
lsrs r2,r0,#31
blne func_00124FB0
ldr r0,.Lpool_00200A28
bl func_001602B8
ldr r0,.Lpool_00200A28+4
bl func_001F4A1C
ands r0,r0,#0x80000000
bpl .Lsuccess_00200A28
ldr r0,.Lpool_00200A28
bl func_00160380
mov r0,#0
pop {r3,r4,r5,pc}
.Lsuccess_00200A28:
ldr r0,.Lpool_00200A28+8
ldrb r4,[r0,#44]
ldrb r5,[r0,#45]
ldr r0,.Lpool_00200A28
bl func_00160380
ldrh r1,[sp]
orr r0,r4,r5,lsl #8
cmp r1,r0
movcs r0,#1
movcc r0,#0
pop {r3,r4,r5,pc}
END func_00200A28
.Lpool_00200A28:
.word service_lock_object_33
.word service_operation_object_33
.word service_result_object_33

BEGIN func_00200ABC
push {lr}
sub sp,sp,#196
mov r2,#0xc0000
mov r1,#192
mov r0,sp
bl func_00124880
mov r1,pc
lsrs r2,r0,#31
blne func_00124FB0
ldr r0,[sp]
add sp,sp,#196
and r0,r0,#32
lsr r0,r0,#5
pop {pc}
END func_00200ABC

BEGIN func_00200B2C
push {lr}
sub sp,sp,#12
mov r0,#0
mov r1,r0
strd r0,[sp]
mov r2,#0x90000
mov r1,#8
mov r0,sp
bl func_00124880
mov r1,pc
lsrs r2,r0,#31
blne func_00124FB0
ldrd r0,[sp]
add sp,sp,#12
pop {pc}
END func_00200B2C

BEGIN func_00200B68
push {lr}
sub sp,sp,#196
mov r2,#0xc0000
mov r1,#192
mov r0,sp
bl func_00124880
mov r1,pc
lsrs r2,r0,#31
blne func_00124FB0
ldr r0,[sp]
add sp,sp,#196
and r0,r0,#64
lsr r0,r0,#6
pop {pc}
END func_00200B68

BEGIN func_00200BA0
push {lr}
sub sp,sp,#196
mov r2,#0xc0000
mov r1,#192
mov r0,sp
bl func_00124880
mov r1,pc
lsrs r2,r0,#31
blne func_00124FB0
ldr r0,[sp]
add sp,sp,#196
and r0,r0,#16
lsr r0,r0,#4
pop {pc}
END func_00200BA0

BEGIN func_00200BD8
push {lr}
sub sp,sp,#196
mov r2,#0xc0000
mov r1,#192
mov r0,sp
bl func_00124880
mov r1,pc
lsrs r2,r0,#31
blne func_00124FB0
ldr r0,[sp]
add sp,sp,#196
and r0,r0,#8
lsr r0,r0,#3
pop {pc}
END func_00200BD8
```

## Branch identity and relocation ledger

There are exactly 20 external ARM branch sites: twelve `R_ARM_CALL` sites and
eight conditional `R_ARM_JUMP24` sites. Local branches are not relocations.

| Function | Ordered branch sites `(offset, relocation, mnemonic, identity)` |
| --- | --- |
| `func_002009A4` | (+0x20, CALL, `bl`, `func_00124880`); (+0x2c, JUMP24, `blne`, `func_00124FB0`) |
| `func_002009F0` | (+0x18, CALL, `bl`, `func_00124880`); (+0x24, JUMP24, `blne`, `func_00124FB0`) |
| `func_00200A28` | (+0x10, CALL, `bl`, `func_00124880`); (+0x1c, JUMP24, `blne`, `func_00124FB0`); (+0x24, CALL, `bl`, `func_001602B8`); (+0x2c, CALL, `bl`, `func_001F4A1C`); (+0x3c, CALL, `bl`, `func_00160380`); (+0x58, CALL, `bl`, `func_00160380`) |
| `func_00200ABC` | (+0x14, CALL, `bl`, `func_00124880`); (+0x20, JUMP24, `blne`, `func_00124FB0`) |
| `func_00200B2C` | (+0x20, CALL, `bl`, `func_00124880`); (+0x2c, JUMP24, `blne`, `func_00124FB0`) |
| `func_00200B68` | (+0x14, CALL, `bl`, `func_00124880`); (+0x20, JUMP24, `blne`, `func_00124FB0`) |
| `func_00200BA0` | (+0x14, CALL, `bl`, `func_00124880`); (+0x20, JUMP24, `blne`, `func_00124FB0`) |
| `func_00200BD8` | (+0x14, CALL, `bl`, `func_00124880`); (+0x20, JUMP24, `blne`, `func_00124FB0`) |

The eight IPC sites share exactly `func_00124880`, reusing the batch-29 IPC
identity. The eight conditional failure sites share exactly `func_00124FB0`.
The lock site is `func_001602B8`, both unlock sites share `func_00160380`, and
the service-operation site is `func_001F4A1C`. Target-side entry re-audit
proves these five destinations are pairwise distinct primary ARM entries.
There are no BLX transfers, interworking veneers, secondary entries, or
indirect calls.

## Literal equality and cumulative contract

There are exactly five ordered `R_ARM_ABS32` pool slots in five singleton
equality classes:

| Identity | Site | Semantic contract |
| --- | --- | --- |
| `service_seed_halfword_33` | `func_002009A4 + 0x44` | Address of the halfword copied into the two-byte transfer buffer before IPC. |
| `service_request_kind_33` | `func_002009A4 + 0x48` | Opaque request selector passed in `r2`. |
| `service_lock_object_33` | `func_00200A28 + 0x74` | Object passed to both lock and unlock operations. |
| `service_operation_object_33` | `func_00200A28 + 0x78` | Object passed to the intervening service operation. |
| `service_result_object_33` | `func_00200A28 + 0x7c` | State object whose bytes 44 and 45 form the little-endian comparison threshold. |

Physical target comparison proves that all five identities are pairwise
unequal and unequal to every prior cumulative IPC literal class. Adding five
slots and five classes to batches 12, 13, and 15 through 32 yields exactly
**512 ordered pool slots in 243 equality classes**. Pool words remain symbolic;
their private values are neither required nor permitted in an implementation.

## Exact-probe evidence

The independent probe assembled the complete schedules above as eight
separate aligned ARM sections. `readelf` reported exactly 25 relocations:
twelve `R_ARM_CALL`, eight `R_ARM_JUMP24`, and five `R_ARM_ABS32`, with the
precise offsets, identities, conditions, and pool order in the ledgers above.

For every function, the probe section was compared with the bounded private
target extent after normalizing only its external branch words and excluding
its symbolic pool words. All remaining body bytes, including local branch
displacements and stack schedules, were exactly equal:

| Function | Exact body bytes |
| --- | ---: |
| `func_002009A4` | 68 |
| `func_002009F0` | 56 |
| `func_00200A28` | 116 |
| `func_00200ABC` | 56 |
| `func_00200B2C` | 60 |
| `func_00200B68` | 56 |
| `func_00200BA0` | 56 |
| `func_00200BD8` | 56 |
| **Total** | **524** |

The normalized external branch words were independently decoded from the
target and resolved to the exact ordered ARM identities above. Direct target
pool comparison independently established the five singleton classes and
their inequality to all prior IPC classes. The current objdiff report
identifies all eight function bodies as unmatched before this batch.

## Implementation constraints

- Implement exactly the eight schedules above in one ARM assembly unit.
- Preserve function order, body sizes, local branch destinations, stack
  layouts, conditions, output widths, flag positions, and pool order.
- Reuse `func_00124880` as the exact existing IPC transfer identity; do not
  substitute a same-shaped transfer operation.
- Keep every external transfer as the specified `bl` or `blne` to its exact
  identity, including both calls to `func_00160380`.
- Introduce exactly the five symbolic literal identities listed above. Do not
  merge them or materialize their private values.
- Do not introduce raw target bytes, instruction encodings, anonymous data
  words, or private addresses.
