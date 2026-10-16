# Probe-verified ARM service/IPC wrappers 34

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

This batch covers seven still-unmatched ARM-state service/IPC wrappers totaling
exactly 576 executable bytes. All seven use the same IPC transfer identity.
Six use the common sign-bit failure reporter directly; the seventh restores
its frame and tail-transfers to that reporter only on failure. The family
includes byte and doubleword transfers, two guarded service-state queries, and
a three-stage availability classifier.

The batch is disjoint from IPC batch 33 (`func_002009A4`, `func_002009F0`,
`func_00200A28`, `func_00200ABC`, `func_00200B2C`, `func_00200B68`,
`func_00200BA0`, and `func_00200BD8`) and from the independently selected
duplicate batch 38 (`func_002EB58C`, `func_002EC008`, and `func_002F9B78`).

## Function, pool, and behavior inventory

All functions and external destinations are ARM mode, four-byte aligned
primary entries. Four destinations have exported inventory names. The fifth,
`service_publish_operation_34`, is a neutral identity for an otherwise
unlabelled primary entry independently bounded by the preceding routine's
ordered pool and its own ordered pool before the next inventoried function.
It is not an alias for, or secondary entry within, a neighbouring function.
Pool offsets are relative to the executable body.

| Function | Size | Ordered pool slots | Visible behavior |
| --- | ---: | --- | --- |
| `func_00109738` | 40 | none | Transfer four bytes at entry `r0`; return the transfer status on success, or restore the frame and tail-transfer to the failure reporter when its sign bit is set. |
| `func_0010EFD8` | 52 | `service_seed_byte_34` at +0x34; `service_request_kind_alpha_34` at +0x38 | Seed a one-byte stack buffer, transfer it, report a negative status, and return the resulting byte. |
| `func_0010F014` | 116 | `service_guard_state_34` at +0x74 | Return zero immediately when guard byte +20 has bit 0 set. Otherwise acquire auxiliary state, transfer four bytes, publish auxiliary byte zero, and return transferred byte one bit 0 normalized to zero or one. |
| `func_0010F158` | 40 | `service_request_kind_beta_34` at +0x28 | Transfer one byte into an uninitialized stack slot, report a negative status, and return the byte. |
| `func_0010F184` | 108 | `service_guard_state_34` at +0x6c | Use the same guard/acquire/transfer/publish sequence as `func_0010F014`, but return transferred byte two without normalization. |
| `func_0011863C` | 68 | `service_request_kind_gamma_34` at +0x44 | Zero an eight-byte stack buffer, transfer eight bytes, and copy the full returned doubleword to entry `r0`. |
| `func_0012439C` | 152 | `service_request_kind_delta_34` at +0x98 | Transfer a 20-byte classifier record, transfer a 192-byte flag record, optionally query a third service, then return class zero, one, or two according to the staged tests. |

## Complete normative mnemonic schedules

The schedules are complete and literal. `BEGIN` emits only the standard ARM
section/function header. `END` terminates the executable body before any
ordered symbolic pool words. Labels and directives occupy no executable bytes.
Preserve every mnemonic, operand, register, condition, stack operation, local
branch destination, no-op, and pool order.

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

.global func_00118C2C,service_publish_operation_34
.global func_00124880,func_00124FB0,func_00145FC0
.global service_seed_byte_34,service_request_kind_alpha_34
.global service_guard_state_34,service_request_kind_beta_34
.global service_request_kind_gamma_34,service_request_kind_delta_34

BEGIN func_00109738
mov r2,#0xb0000
mov r1,#4
push {r4,lr}
bl func_00124880
mov r1,pc
lsrs r2,r0,#31
beq .Lreturn_00109738
pop {r4,lr}
b func_00124FB0
.Lreturn_00109738:
pop {r4,pc}
END func_00109738

BEGIN func_0010EFD8
ldr r0,.Lpool_0010EFD8
push {r3,lr}
ldr r2,.Lpool_0010EFD8+4
mov r1,#1
ldrb r0,[r0]
strb r0,[sp]
mov r0,sp
bl func_00124880
mov r1,pc
lsrs r2,r0,#31
blne func_00124FB0
ldrb r0,[sp]
pop {r3,pc}
END func_0010EFD8
.Lpool_0010EFD8:
.word service_seed_byte_34
.word service_request_kind_alpha_34

BEGIN func_0010F014
ldr r0,.Lpool_0010F014
ldrb r0,[r0,#20]
tst r0,#1
movne r0,#0
bxne lr
push {lr}
sub sp,sp,#12
add r0,sp,#4
bl func_00118C2C
ands r1,r0,#0x80000000
bpl .Lacquired_0010F014
mov r1,pc
lsrs r2,r0,#31
blne func_00124FB0
.Lacquired_0010F014:
mov r0,sp
mov r2,#0x130000
mov r1,#4
bl func_00124880
mov r1,pc
lsrs r2,r0,#31
blne func_00124FB0
ldrb r0,[sp,#4]
nop
bl service_publish_operation_34
ldrb r0,[sp,#1]
add sp,sp,#12
ands r0,r0,#1
movne r0,#1
pop {pc}
END func_0010F014
.Lpool_0010F014:
.word service_guard_state_34

BEGIN func_0010F158
push {r3,lr}
ldr r2,.Lpool_0010F158
mov r1,#1
mov r0,sp
bl func_00124880
mov r1,pc
lsrs r2,r0,#31
blne func_00124FB0
ldrb r0,[sp]
pop {r3,pc}
END func_0010F158
.Lpool_0010F158:
.word service_request_kind_beta_34

BEGIN func_0010F184
ldr r0,.Lpool_0010F184
ldrb r0,[r0,#20]
tst r0,#1
movne r0,#0
bxne lr
push {lr}
sub sp,sp,#12
add r0,sp,#4
bl func_00118C2C
ands r1,r0,#0x80000000
bpl .Lacquired_0010F184
mov r1,pc
lsrs r2,r0,#31
blne func_00124FB0
.Lacquired_0010F184:
mov r0,sp
mov r2,#0x130000
mov r1,#4
bl func_00124880
mov r1,pc
lsrs r2,r0,#31
blne func_00124FB0
ldrb r0,[sp,#4]
nop
bl service_publish_operation_34
ldrb r0,[sp,#2]
add sp,sp,#12
pop {pc}
END func_0010F184
.Lpool_0010F184:
.word service_guard_state_34

BEGIN func_0011863C
push {r4,lr}
mov r4,r0
sub sp,sp,#8
mov r0,#0
mov r1,r0
strd r0,[sp]
ldr r2,.Lpool_0011863C
mov r1,#8
mov r0,sp
bl func_00124880
mov r1,pc
lsrs r2,r0,#31
blne func_00124FB0
ldrd r0,[sp]
strd r0,[r4]
add sp,sp,#8
pop {r4,pc}
END func_0011863C
.Lpool_0011863C:
.word service_request_kind_gamma_34

BEGIN func_0012439C
push {lr}
sub sp,sp,#220
ldr r2,.Lpool_0012439C
mov r1,#20
add r0,sp,#192
bl func_00124880
mov r1,pc
lsrs r2,r0,#31
blne func_00124FB0
mov r2,#0xc0000
mov r1,#192
mov r0,sp
bl func_00124880
mov r1,pc
lsrs r2,r0,#31
blne func_00124FB0
ldrb r0,[sp,#192]
cmp r0,#0
beq .Lclass_zero_0012439C
add r0,sp,#212
bl func_00145FC0
mov r1,pc
lsrs r2,r0,#31
blne func_00124FB0
ldrb r0,[sp,#212]
cmp r0,#0
beq .Lclass_zero_0012439C
ldr r0,[sp]
tst r0,#1
ldrbne r0,[sp,#193]
add sp,sp,#220
cmpne r0,#0
moveq r0,#2
movne r0,#1
pop {pc}
.Lclass_zero_0012439C:
add sp,sp,#220
mov r0,#0
pop {pc}
END func_0012439C
.Lpool_0012439C:
.word service_request_kind_delta_34
```

## Branch identity and relocation ledger

There are exactly 24 external ARM branch sites: thirteen `R_ARM_CALL` sites
and eleven `R_ARM_JUMP24` sites. The latter comprise ten conditional `blne`
sites and the single unconditional failure tail branch. Local branches are not
relocations.

| Function | Ordered branch sites `(offset, relocation, mnemonic, identity)` |
| --- | --- |
| `func_00109738` | (+0x0c, CALL, `bl`, `func_00124880`); (+0x20, JUMP24, `b`, `func_00124FB0`) |
| `func_0010EFD8` | (+0x1c, CALL, `bl`, `func_00124880`); (+0x28, JUMP24, `blne`, `func_00124FB0`) |
| `func_0010F014` | (+0x20, CALL, `bl`, `func_00118C2C`); (+0x34, JUMP24, `blne`, `func_00124FB0`); (+0x44, CALL, `bl`, `func_00124880`); (+0x50, JUMP24, `blne`, `func_00124FB0`); (+0x5c, CALL, `bl`, `service_publish_operation_34`) |
| `func_0010F158` | (+0x10, CALL, `bl`, `func_00124880`); (+0x1c, JUMP24, `blne`, `func_00124FB0`) |
| `func_0010F184` | (+0x20, CALL, `bl`, `func_00118C2C`); (+0x34, JUMP24, `blne`, `func_00124FB0`); (+0x44, CALL, `bl`, `func_00124880`); (+0x50, JUMP24, `blne`, `func_00124FB0`); (+0x5c, CALL, `bl`, `service_publish_operation_34`) |
| `func_0011863C` | (+0x24, CALL, `bl`, `func_00124880`); (+0x30, JUMP24, `blne`, `func_00124FB0`) |
| `func_0012439C` | (+0x14, CALL, `bl`, `func_00124880`); (+0x20, JUMP24, `blne`, `func_00124FB0`); (+0x30, CALL, `bl`, `func_00124880`); (+0x3c, JUMP24, `blne`, `func_00124FB0`); (+0x50, CALL, `bl`, `func_00145FC0`); (+0x5c, JUMP24, `blne`, `func_00124FB0`) |

The exhaustive destination audit is:

| Destination identity | Equal sites | Exact forms and GNU relocations | Mode/alignment | Entry status |
| --- | ---: | --- | --- | --- |
| `func_00124880` | 8 | eight `bl` / `R_ARM_CALL` | ARM / 4-byte | inventoried primary entry |
| `func_00124FB0` | 11 | ten `blne` and one `b`, all `R_ARM_JUMP24` | ARM / 4-byte | inventoried primary entry |
| `func_00118C2C` | 2 | two `bl` / `R_ARM_CALL` | ARM / 4-byte | inventoried primary entry |
| `service_publish_operation_34` | 2 | two `bl` / `R_ARM_CALL` | ARM / 4-byte | independently bounded unlabelled primary entry |
| `func_00145FC0` | 1 | one `bl` / `R_ARM_CALL` | ARM / 4-byte | inventoried primary entry |

These five branch-destination equality classes account for all 24 sites. No
site from different rows resolves to the same physical entry.

The seven wrappers contain eight IPC sites, all exactly `func_00124880`, and
eleven failure sites, all exactly `func_00124FB0`. The two acquire sites share
`func_00118C2C`; the two publish sites share
`service_publish_operation_34`; and the final classifier query is
`func_00145FC0`. Target-side entry re-audit proves these five destinations are
pairwise distinct primary ARM entries. The publish destination has no exported
function-inventory name: its entry begins immediately after the ordered pool
of the preceding primary routine, has a complete independent prologue/body/
epilogue and ordered pool, and ends before `func_00118C2C`. Exactly the two
publish calls in this batch target its first instruction; neither targets a
secondary offset. There are no BLX transfers, interworking veneers, secondary
entries, or indirect calls.

## Semantic branch contracts

- `func_00109738` deliberately uses `beq` around a frame-restoring
  `pop {r4,lr}` followed by an unconditional tail branch. It must not become a
  conventional conditional call.
- Both guarded queries test guard byte +20 bit 0 before creating a frame. If
  set, each returns zero through `bxne lr`. A negative acquire status is
  reported, but execution still reaches the IPC transfer and publish call.
- `func_0010F014` returns exactly bit 0 of transferred byte one. The final
  `ands` plus conditional move is part of the schedule. `func_0010F184`
  returns transferred byte two as an unnormalized byte.
- `func_0012439C` returns zero if classifier byte zero or third-service byte
  zero is zero. Otherwise it returns one exactly when flag-record word-zero
  bit 0 and classifier byte one are both nonzero; it returns two for the other
  nonzero cases. Its stack is released before the final conditional compare
  and moves.

## Literal equality and cumulative contract

There are exactly seven ordered `R_ARM_ABS32` pool slots in six equality
classes:

| Identity | Sites | Semantic contract |
| --- | --- | --- |
| `service_seed_byte_34` | `func_0010EFD8 + 0x34` | Address of the byte copied into the one-byte buffer before IPC. |
| `service_request_kind_alpha_34` | `func_0010EFD8 + 0x38` | Opaque request selector for the seeded byte transfer. |
| `service_guard_state_34` | `func_0010F014 + 0x74`; `func_0010F184 + 0x6c` | Shared state object whose byte +20 bit 0 guards both queries. |
| `service_request_kind_beta_34` | `func_0010F158 + 0x28` | Opaque request selector for the one-byte result transfer. |
| `service_request_kind_gamma_34` | `func_0011863C + 0x44` | Opaque request selector for the eight-byte result transfer. |
| `service_request_kind_delta_34` | `func_0012439C + 0x98` | Opaque request selector for the classifier-record transfer. |

Physical target comparison proves the two `service_guard_state_34` slots are
equal. The other five identities are pairwise unequal, unequal to the guard
identity, and unequal to every prior cumulative IPC literal class. Adding
seven slots and six classes to batches 12, 13, and 15 through 33 yields exactly
**519 ordered pool slots in 249 equality classes**. Pool words remain symbolic;
their private values are neither required nor permitted in an implementation.

## Exact-probe evidence

The independent probe assembled the complete schedules above as seven
separate aligned ARM sections. `readelf` reported exactly 31 relocations:
thirteen `R_ARM_CALL`, eleven `R_ARM_JUMP24`, and seven `R_ARM_ABS32`, with the
precise offsets, identities, conditions, equality, and pool order in the
ledgers above.

For every function, the probe section was compared with the bounded private
target extent after normalizing only its external branch words and excluding
its symbolic pool words. All remaining body bytes, including local branch
displacements, no-ops, and stack schedules, were exactly equal:

| Function | Exact body bytes |
| --- | ---: |
| `func_00109738` | 40 |
| `func_0010EFD8` | 52 |
| `func_0010F014` | 116 |
| `func_0010F158` | 40 |
| `func_0010F184` | 108 |
| `func_0011863C` | 68 |
| `func_0012439C` | 152 |
| **Total** | **576** |

The normalized external branch words were independently decoded from the
target and resolved to the exact ordered ARM identities above. Direct target
pool comparison independently established the six classes and their stated
cross-batch inequalities. The current objdiff report identifies all seven
function bodies as unmatched before this batch.

## Implementation constraints

- Implement exactly the seven schedules above in one ARM assembly unit.
- Preserve function order, body sizes, local branch destinations, stack
  layouts, conditions, output widths, no-ops, and pool order.
- Reuse `func_00124880` and `func_00124FB0` as the exact established transfer
  and failure identities. Preserve the tail failure shape of `func_00109738`.
- Reuse one shared `service_guard_state_34` identity for both equal pool slots;
  do not merge any of the other five literal classes.
- Keep all pool words symbolic. Do not introduce raw target bytes, instruction
  encodings, anonymous data words, or private addresses.
