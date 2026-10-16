# Probe-verified ARM IPC/service wrappers 31

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

This batch covers sixteen still-unmatched ARM-state service wrappers totaling
exactly 688 executable bytes. They form the checked/status layer immediately
above an already specified IPC command family. Fifteen distinct operation
identities are direct IPC calls. The remaining calls perform service lifecycle,
request sizing, or shared failure handling. Two wrappers also close a returned
kernel handle with public CTR SVC 35.

The batch is disjoint from duplicate batch 33 (`func_0015E4C4`,
`func_0017DAEC`, `func_0017DE68`, `func_005622E0`, `func_0056348C`,
`func_00563FA0`, `func_00564AB4`, `func_005654C8`, and `func_00565FDC`) and
from every function in runtime batch 32.

## Function, pool, and call inventory

All functions are ARM mode and 4-byte aligned. Pool offsets are relative to
the executable body. “Failure” means the already specified
`runtime_failure_raise_entry_31`; the destructive `lsrs r0,r0,#31` supplies
zero or one to the following decision/call.

| Function | Size | Ordered literal slots | Ordered external transfers | Visible behavior |
| --- | ---: | --- | --- | --- |
| `func_002C5C4C` | 36 | `service_state_block_31` at +0x24 | `service_shutdown_prepare_31`, `service_shutdown_secondary_31`, tail `service_shutdown_finish_31` | Return immediately when state byte 1 is zero; otherwise run the three-stage shutdown chain. |
| `func_002C5C74` | 28 | none | `func_002C6104`, failure | Checked zero-argument IPC call. |
| `func_002C5D80` | 56 | `service_session_handle_31` at +0x38 | `func_002C6254`, failure | Dereference the shared session slot, forward four entry registers plus the untouched saved-`r3` word as a fifth stack argument, and check status. |
| `func_002C5DBC` | 28 | none | `func_002C62B0`, failure | Checked zero-argument IPC call. |
| `func_002C5DD8` | 56 | `service_session_handle_31` at +0x38 | `func_002C62EC`, failure | Same forwarding schedule as `func_002C5D80`, with a distinct IPC operation. |
| `func_002C5E14` | 160 | `service_initialized_byte_31` at +0xa0, then `service_open_accepted_status_31` at +0xa4 | `service_startup_31`, failure, `service_request_size_31`, secondary entry `service_open_31`, failure, `func_002C6450`, failure | Idempotent service startup/open, accepted-status handling, final IPC request, conditional handle close, and initialization-byte commit. |
| `func_002C5EBC` | 28 | none | `func_002C6378`, failure | Checked IPC call. |
| `func_002C5ED8` | 28 | none | `func_002C63B4`, failure | Checked IPC call. |
| `func_002C5EF4` | 28 | none | `func_002C63E4`, failure | Checked IPC call. |
| `func_002C5F10` | 36 | `service_query_accepted_status_31` at +0x24 | `func_002C6420`, failure | Preserve this operation's accepted status; otherwise raise on a negative status and return zero. |
| `func_002C5F38` | 28 | none | `func_002C6480`, failure | Query into a saved stack byte and return it sign-extended. |
| `func_002C5F54` | 28 | none | `func_002C64BC`, failure | Checked IPC call. |
| `func_002C5F70` | 28 | none | `func_002C64F8`, failure | Checked IPC call. |
| `func_002C601C` | 64 | none | `func_002C6534`, failure | Acquire a replacement handle into a zeroed stack slot, close the old nonzero handle with SVC 35, then install the replacement. |
| `func_002C60CC` | 28 | none | `func_002C65E8`, failure | Checked IPC call. |
| `func_002C60E8` | 28 | none | `func_002C6624`, failure | Checked IPC call. |

## Complete normative mnemonic schedules

The schedules are complete and literal. `B` emits only the standard ARM
section/function header. `E`, `EP1`, and `EP2` end the executable body before
emitting zero, one, or two ordered symbolic pool entries. Labels and directives
occupy no executable bytes. Preserve every mnemonic, operand, register,
condition, branch shape, stack operation, NOP, SVC, and pool order.

```asm
.syntax unified
.arch armv6k
.arm
.macro B f
 .section .text.\f,"ax",%progbits;.balign 4;.arm;.global \f;.type \f,%function
\f:
.endm
.macro E f
 .size \f,.-\f
.endm
.macro EP1 f,p0
 .size \f,.-\f;.Lpool_\f:.word \p0
.endm
.macro EP2 f,p0,p1
 .size \f,.-\f;.Lpool_\f:.word \p0;.word \p1
.endm

.global service_shutdown_prepare_31,service_shutdown_secondary_31
.global service_shutdown_finish_31,service_startup_31,service_request_size_31
.global service_open_31,runtime_failure_raise_entry_31
.global service_state_block_31,service_session_handle_31
.global service_initialized_byte_31,service_open_accepted_status_31
.global service_query_accepted_status_31
.global func_002C6104,func_002C6254,func_002C62B0,func_002C62EC
.global func_002C6378,func_002C63B4,func_002C63E4,func_002C6420
.global func_002C6450,func_002C6480,func_002C64BC,func_002C64F8
.global func_002C6534,func_002C65E8,func_002C6624

B func_002C5C4C
ldr r0,.Lpool_func_002C5C4C;ldrb r0,[r0,#1];cmp r0,#0;bxeq lr
push {r4,lr};bl service_shutdown_prepare_31
bl service_shutdown_secondary_31;pop {r4,lr};b service_shutdown_finish_31
EP1 func_002C5C4C,service_state_block_31

B func_002C5C74
push {r4,lr};bl func_002C6104;lsrs r0,r0,#31;beq .Lret_002C5C74
pop {r4,lr};b runtime_failure_raise_entry_31
.Lret_002C5C74:pop {r4,pc}
E func_002C5C74

B func_002C5D80
mov ip,r0;ldr r0,.Lpool_func_002C5D80;push {r3,lr};ldr r0,[r0]
str r3,[sp];mov r3,r2;mov r2,r1;mov r1,ip;bl func_002C6254
lsrs r0,r0,#31;beq .Lret_002C5D80;pop {r3,lr}
b runtime_failure_raise_entry_31
.Lret_002C5D80:pop {r3,pc}
EP1 func_002C5D80,service_session_handle_31

B func_002C5DBC
push {r4,lr};bl func_002C62B0;lsrs r0,r0,#31;beq .Lret_002C5DBC
pop {r4,lr};b runtime_failure_raise_entry_31
.Lret_002C5DBC:pop {r4,pc}
E func_002C5DBC

B func_002C5DD8
mov ip,r0;ldr r0,.Lpool_func_002C5DD8;push {r3,lr};ldr r0,[r0]
str r3,[sp];mov r3,r2;mov r2,r1;mov r1,ip;bl func_002C62EC
lsrs r0,r0,#31;beq .Lret_002C5DD8;pop {r3,lr}
b runtime_failure_raise_entry_31
.Lret_002C5DD8:pop {r3,pc}
EP1 func_002C5DD8,service_session_handle_31

B func_002C5E14
push {r4,r5,r6,lr};mov r5,r0;ldr r4,.Lpool_func_002C5E14;mov r6,r1
ldrb r0,[r4];cmp r0,#0;movne r0,#1;bne .Lreturn_002C5E14
bl service_startup_31;lsrs r0,r0,#31
blne runtime_failure_raise_entry_31;mov r0,r6;bl service_request_size_31
mov r2,r0;mov r3,#1;mov r1,r6;mov r0,r5;bl service_open_31
ands r1,r0,#0x80000000;bpl .Lrequest_002C5E14
ldr r1,.Lpool_func_002C5E14+4;cmp r0,r1;beq .Lzero_002C5E14
lsrs r0,r0,#31;blne runtime_failure_raise_entry_31
.Lrequest_002C5E14:nop;bl func_002C6450;ands r0,r0,#0x80000000;nop
bpl .Lmark_002C5E14;ldr r0,[r5];svc #35;lsrs r0,r0,#31;nop
blne runtime_failure_raise_entry_31
.Lzero_002C5E14:mov r0,#0
.Lreturn_002C5E14:pop {r4,r5,r6,pc}
.Lmark_002C5E14:mov r0,#1;strb r0,[r4];pop {r4,r5,r6,pc}
EP2 func_002C5E14,service_initialized_byte_31,service_open_accepted_status_31

B func_002C5EBC
push {r4,lr};bl func_002C6378;lsrs r0,r0,#31;beq .Lret_002C5EBC
pop {r4,lr};b runtime_failure_raise_entry_31
.Lret_002C5EBC:pop {r4,pc}
E func_002C5EBC

B func_002C5ED8
push {r4,lr};bl func_002C63B4;lsrs r0,r0,#31;beq .Lret_002C5ED8
pop {r4,lr};b runtime_failure_raise_entry_31
.Lret_002C5ED8:pop {r4,pc}
E func_002C5ED8

B func_002C5EF4
push {r4,lr};bl func_002C63E4;lsrs r0,r0,#31;beq .Lret_002C5EF4
pop {r4,lr};b runtime_failure_raise_entry_31
.Lret_002C5EF4:pop {r4,pc}
E func_002C5EF4

B func_002C5F10
push {r4,lr};bl func_002C6420;ldr r1,.Lpool_func_002C5F10;cmp r0,r1
beq .Lret_002C5F10;lsrs r0,r0,#31
blne runtime_failure_raise_entry_31;mov r0,#0
.Lret_002C5F10:pop {r4,pc}
EP1 func_002C5F10,service_query_accepted_status_31

B func_002C5F38
push {r3,lr};mov r0,sp;bl func_002C6480;lsrs r0,r0,#31
blne runtime_failure_raise_entry_31;ldrsb r0,[sp];pop {r3,pc}
E func_002C5F38

B func_002C5F54
push {r4,lr};bl func_002C64BC;lsrs r0,r0,#31;beq .Lret_002C5F54
pop {r4,lr};b runtime_failure_raise_entry_31
.Lret_002C5F54:pop {r4,pc}
E func_002C5F54

B func_002C5F70
push {r4,lr};bl func_002C64F8;lsrs r0,r0,#31;beq .Lret_002C5F70
pop {r4,lr};b runtime_failure_raise_entry_31
.Lret_002C5F70:pop {r4,pc}
E func_002C5F70

B func_002C601C
push {r3,r4,r5,lr};mov r4,r0;mov r5,#0;mov r0,sp;str r5,[sp]
bl func_002C6534;lsrs r0,r0,#31;blne runtime_failure_raise_entry_31
ldr r0,[r4];cmp r0,#0;beq .Linstall_002C601C;svc #35;str r5,[r4]
.Linstall_002C601C:ldr r0,[sp];str r0,[r4];pop {r3,r4,r5,pc}
E func_002C601C

B func_002C60CC
push {r4,lr};bl func_002C65E8;lsrs r0,r0,#31;beq .Lret_002C60CC
pop {r4,lr};b runtime_failure_raise_entry_31
.Lret_002C60CC:pop {r4,pc}
E func_002C60CC

B func_002C60E8
push {r4,lr};bl func_002C6624;lsrs r0,r0,#31;beq .Lret_002C60E8
pop {r4,lr};b runtime_failure_raise_entry_31
.Lret_002C60E8:pop {r4,pc}
E func_002C60E8
```

## Equality and relocation ledger

There are exactly 38 external ARM branch sites: 20 `R_ARM_CALL` sites and 18
`R_ARM_JUMP24` sites. GNU Arm classifies the six conditional linked transfers
as `R_ARM_JUMP24`; local conditional branches are not relocations.

A target-side re-audit of every site established that 37 destinations are
standalone ARM function starts and one is not. The unconditional `bl` at
`func_002C5E14 + 0x44` targets `service_open_31`, a four-byte-aligned ARM
secondary code entry with no standalone function-start row in the neutral
inventory. It remains an `R_ARM_CALL` relocation and must be spelled
`bl service_open_31`; it is not a `blx`, conditional transfer, veneer, or call
to the next inventoried function. An audit must validate its alignment and
surrounding ARM instruction stream without requiring a function-start row.

- `runtime_failure_raise_entry_31` is one shared identity at seventeen sites:
  eleven tail branches and six conditional linked calls. Physical target identity
  comparison proves it is exactly the identity established by runtime batch 31,
  not a new same-shaped helper.
- The fifteen `func_002C61xx` through `func_002C66xx` operation targets are all
  distinct, already specified ARM IPC functions. Each occurs once here.
- `service_shutdown_prepare_31`, `service_shutdown_secondary_31`, and
  `service_shutdown_finish_31` are three distinct ARM identities, each used
  once and in that order by `func_002C5C4C`.
- `service_startup_31`, `service_request_size_31`, and `service_open_31` are
  three further distinct ARM identities, each used once by `func_002C5E14`.
  The first two are primary function entries; `service_open_31` is the sole
  secondary entry in this batch.
- Every call and tail target is ARM mode and at least 4-byte aligned. The
  other 37 sites resolve to primary ARM function entries. No BLX,
  interworking veneer, or indirect call is present.
- The seventeen failure sites form one destination-equality class. Each of
  the other twenty-one operation identities is a singleton class, and all
  twenty-two classes are pairwise distinct.

There are exactly six ordered `R_ARM_ABS32` pool slots in five equality
classes:

| Identity | Sites | Equality contract |
| --- | --- | --- |
| `service_state_block_31` | `func_002C5C4C + 0x24` | new, unique class |
| `service_session_handle_31` | `func_002C5D80 + 0x38`; `func_002C5DD8 + 0x38` | exactly equal at both sites |
| `service_initialized_byte_31` | `func_002C5E14 + 0xa0` | new, unique class |
| `service_open_accepted_status_31` | `func_002C5E14 + 0xa4` | new, unique class |
| `service_query_accepted_status_31` | `func_002C5F10 + 0x24` | new, unique class; physically unequal to the open-operation accepted status |
| — | — | the session-handle pair is the only equal pair; all other classes are pairwise unequal |

Direct physical comparison of all six target slots confirms five classes:
the two session-handle slots are equal, while the two operation-specific
accepted-status slots are unequal. All five classes are unequal to every
literal identity in IPC batches 12, 13,
and 15 through 30. Adding this batch to that cumulative contract yields exactly
474 ordered pool slots in 237 equality classes. Pool words are symbolic only;
their private values are neither required nor permitted in an implementation.

## Exact-probe evidence

The complete schedule above was independently assembled for ARMv6K. For each
function, the probe section had the specified executable size and its six pool
slots occurred at the displayed offsets and order. Readelf reported exactly 38
ARM branch relocations with the types and identities described above and six
ordered `R_ARM_ABS32` relocations. The target-side destination audit separately
confirmed 37 primary entries and the one documented aligned secondary entry.
After normalizing only those 44 relocation sites, every executable byte of all
sixteen probe bodies matched the bounded target extraction: 688 of 688 bytes,
with no residual mismatch. The five literal equality classes were separately
confirmed from the physical target words without recording their values.

The current unmatched report classifies all sixteen functions as zero-percent
matched before implementation. Duplicate batch 33 and runtime batch 32 contain
none of their names, calls, or pool slots.
