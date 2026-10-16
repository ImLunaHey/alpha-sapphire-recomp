# Probe-verified ARM service/IPC wrappers 43

## Scope and provenance

- Target: `AS_EUR_REV2`, independently verified in `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the current objdiff unmatched report, bounded private-target
  control/data-flow inspection, branch-target resolution, physical literal
  identity comparison, and an independent GNU Arm exact-schedule probe.
- Probe toolchain: GNU Arm assembler, objdump, objcopy, and readelf 2.44.
- Clean-room role: analysis/specification only. No target bytes, instruction
  encodings, private addresses, private literal values, implementation, game
  assets, or proprietary source are present.

This batch covers six still-unmatched ARM-state service adapters totaling
exactly 552 executable bytes. They guard shared dispatch, initialize and
finalize service state, synchronize access, wait for completion, close owned
handles, replace stale handles, and invoke delegated cleanup.

The selection is disjoint from every function named by the existing neutral
template manifests. Every selected function is reported as unmatched in the
current target report.

## Function and behavior inventory

All functions and all eight direct external destinations are ARM mode,
four-byte aligned primary entries.

| Function | Size | Ordered pool slots | Visible behavior |
| --- | ---: | --- | --- |
| `func_00148344` | 88 | `service_dispatch_state_42` at +0x58; `service_unavailable_result_42` at +0x5c | If shared dispatch is unavailable, return the established unavailable result. Otherwise finalize dispatch state, close and clear its owned handle when present, conditionally clean its subordinate object, clear availability, and return zero. |
| `func_0010FB40` | 92 | none | Lock state at +8, set a one-byte completion guard once, signal the nested handle when present, report a negative service result, unlock, and return zero. |
| `func_00164F80` | 92 | `service_lifecycle_object_43` at +0x5c; `service_initialized_byte_35` at +0x60; `service_replacement_source_43` at +0x64 | Lock a lifecycle object. When initialized, finalize a subordinate member, close the owned handle, replace a state word from a shared source, and clear initialization. In either case, tail-transfer the lifecycle object to the unlock destination. |
| `func_0017080C` | 92 | none | When handle +20 exists, clear the paired state at +8/+12 or invoke service 32 and delegated cleanup according to the byte at +24, then close and clear handle +20. |
| `func_0018C6B4` | 92 | `service_thread_completion_counts_43` at +0x5c | Lock state at +8, wait indefinitely on handle +0, report a negative wait result, invoke service 25 on the same handle, report a negative result, increment its indexed completion byte, and tail-transfer to the unlock destination. |
| `func_00126414` | 96 | `ipc_handle_slot_alpha` at +0x60; `service_absent_result_41_a` at +0x64; `service_handle_replacement_41_a` at +0x68; `service_wait_handle_42` at +0x6c | Close and replace a shared handle when present, preserve the target's exact error-report context, then invoke service 20 on a second shared handle and tail-transfer negative results to the common reporter. |

## Complete normative mnemonic schedules

The schedules are complete and literal. `BEGIN` emits only the standard ARM
section/function header. `END` terminates the executable body; each following
pool belongs to the preceding section but is outside that function's body
size. Labels and directives occupy no executable bytes. Preserve every
mnemonic, operand, register, condition, stack operation, service-call
immediate, and local branch destination. In particular, the leading self-move
in `func_00164F80` and the `nop` in `func_00126414` are literal schedule
entries.

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

.global func_001644DC,func_0017080C,func_001602B8,func_001603A0
.global func_00160380,func_00174314,func_00178228,func_00124BA4
.global service_dispatch_state_42,service_unavailable_result_42
.global service_lifecycle_object_43,service_initialized_byte_35
.global service_replacement_source_43,service_thread_completion_counts_43
.global ipc_handle_slot_alpha,service_absent_result_41_a
.global service_handle_replacement_41_a,service_wait_handle_42

BEGIN func_00148344
push {r4,r5,r6,lr}
mov r5,#0
ldr r4,.Lpool_00148344
ldrb r0,[r4,#4]
cmp r0,#0
ldreq r0,.Lpool_00148344+4
beq .Lfinish_00148344
add r0,r4,#44
bl func_001644DC
ldr r0,[r4,#40]
add r6,r4,#40
cmp r0,#0
beq .Lskip_handle_00148344
svc #0x23
str r5,[r6]
.Lskip_handle_00148344:
ldr r0,[r4,#28]
cmp r0,#0
addne r0,r4,#8
blne func_0017080C
mov r0,r5
strb r5,[r4,#4]
.Lfinish_00148344:
pop {r4,r5,r6,pc}
END func_00148344
.Lpool_00148344:
.word service_dispatch_state_42
.word service_unavailable_result_42

BEGIN func_0010FB40
push {r4,r5,r6,lr}
mov r5,r0
add r4,r0,#8
mov r0,r4
bl func_001602B8
ldrb r0,[r5,#4]
cmp r0,#0
bne .Lunlock_0010FB40
ldr r0,[r5,#20]
mov r1,#1
strb r1,[r5,#4]
cmp r0,#0
beq .Lunlock_0010FB40
ldr r0,[r0]
cmp r0,#0
beq .Lunlock_0010FB40
svc #0x18
lsrs r1,r0,#31
blne func_001603A0
.Lunlock_0010FB40:
mov r0,r4
bl func_00160380
mov r0,#0
pop {r4,r5,r6,pc}
END func_0010FB40

BEGIN func_00164F80
mov r0,r0
ldr r0,.Lpool_00164F80
push {r4,lr}
bl func_001602B8
ldr r4,.Lpool_00164F80+4
ldrb r0,[r4]
cmp r0,#0
beq .Ltail_00164F80
ldr r0,[r4,#28]
bl func_00174314
ldr r0,[r4,#16]
svc #0x23
ldr r0,.Lpool_00164F80+8
ldr r0,[r0,#4]
str r0,[r4,#20]
mov r0,#0
strb r0,[r4]
ldr r0,.Lpool_00164F80
pop {r4,lr}
b func_00160380
.Ltail_00164F80:
ldr r0,.Lpool_00164F80
pop {r4,lr}
b func_00160380
END func_00164F80
.Lpool_00164F80:
.word service_lifecycle_object_43
.word service_initialized_byte_35
.word service_replacement_source_43

BEGIN func_0017080C
push {r4,r5,r6,lr}
mov r4,r0
ldr r0,[r0,#20]
cmp r0,#0
beq .Lfinish_0017080C
ldr r1,[r4,#8]
mov r5,#0
cmp r1,#0
beq .Lclose_0017080C
ldrb r2,[r4,#24]
cmp r2,#0
streq r5,[r4,#8]
streq r5,[r4,#12]
beq .Lclose_0017080C
svc #0x20
mov r0,r4
bl func_00178228
.Lclose_0017080C:
ldr r0,[r4,#20]!
cmp r0,#0
beq .Lfinish_0017080C
svc #0x23
str r5,[r4]
.Lfinish_0017080C:
pop {r4,r5,r6,pc}
END func_0017080C

BEGIN func_0018C6B4
push {r4,r5,r6,lr}
mov r5,r0
add r4,r0,#8
mov r0,r4
bl func_001602B8
mvn r2,#0
ldr r0,[r5]
mov r3,r2
svc #0x24
lsrs r1,r0,#31
blne func_001603A0
ldr r0,[r5]
svc #0x19
lsrs r1,r0,#31
blne func_001603A0
ldr r0,.Lpool_0018C6B4
mov r1,r0
ldrb r0,[r0,r5]
add r0,r0,#1
strb r0,[r1,r5]
mov r0,r4
pop {r4,r5,r6,lr}
b func_00160380
END func_0018C6B4
.Lpool_0018C6B4:
.word service_thread_completion_counts_43

BEGIN func_00126414
push {r4,lr}
ldr r4,.Lpool_00126414
ldr r0,[r4]
cmp r0,#0
ldreq r0,.Lpool_00126414+4
beq .Lreport_first_00126414
svc #0x23
ldr r1,.Lpool_00126414+8
ldr r1,[r1]
str r1,[r4]
.Lreport_first_00126414:
mov r1,pc
lsrs r2,r0,#31
blne func_00124BA4
ldr r0,.Lpool_00126414+12
ldr r0,[r0]
cmp r0,#0
beq .Lfinish_00126414
svc #0x14
lsrs r1,r0,#31
nop
beq .Lfinish_00126414
pop {r4,lr}
b func_001603A0
.Lfinish_00126414:
pop {r4,pc}
END func_00126414
.Lpool_00126414:
.word ipc_handle_slot_alpha
.word service_absent_result_41_a
.word service_handle_replacement_41_a
.word service_wait_handle_42
```

## Branch identity and relocation ledger

There are exactly sixteen symbolic external ARM branch sites: seven
`R_ARM_CALL` sites and nine `R_ARM_JUMP24` sites.

| Function | Ordered branch sites `(offset, relocation, mnemonic, identity)` |
| --- | --- |
| `func_00148344` | (+0x20, CALL, `bl`, `func_001644DC`); (+0x48, JUMP24, `blne`, `func_0017080C`) |
| `func_0010FB40` | (+0x10, CALL, `bl`, `func_001602B8`); (+0x48, JUMP24, `blne`, `func_001603A0`); (+0x50, CALL, `bl`, `func_00160380`) |
| `func_00164F80` | (+0x0c, CALL, `bl`, `func_001602B8`); (+0x24, CALL, `bl`, `func_00174314`); (+0x4c, JUMP24, `b`, `func_00160380`); (+0x58, JUMP24, `b`, `func_00160380`) |
| `func_0017080C` | (+0x40, CALL, `bl`, `func_00178228`) |
| `func_0018C6B4` | (+0x10, CALL, `bl`, `func_001602B8`); (+0x28, JUMP24, `blne`, `func_001603A0`); (+0x38, JUMP24, `blne`, `func_001603A0`); (+0x58, JUMP24, `b`, `func_00160380`) |
| `func_00126414` | (+0x30, JUMP24, `blne`, `func_00124BA4`); (+0x58, JUMP24, `b`, `func_001603A0`) |

`func_001602B8` is a three-site destination class. `func_001603A0` and
`func_00160380` are four-site destination classes. The other five destination
identities are singleton classes, and all eight destination classes are
pairwise distinct.

## Literal identity ledger and cumulative counts

The ten ordered pool slots form ten distinct IPC-template literal equality
classes. Seven reuse established identities; the remaining three identities
are new, mutually distinct, and distinct from every earlier IPC-template
literal identity.

| Identity | Ordered sites | Status and semantic role |
| --- | --- | --- |
| `service_dispatch_state_42` | `func_00148344 + 0x58` | Reused shared dispatch availability and owned state. |
| `service_unavailable_result_42` | `func_00148344 + 0x5c` | Reused result returned when shared dispatch is unavailable. |
| `service_lifecycle_object_43` | `func_00164F80 + 0x5c` | New lifecycle object passed to the shared lock and unlock destinations. |
| `service_initialized_byte_35` | `func_00164F80 + 0x60` | Reused initialized-state byte and adjacent owned members. |
| `service_replacement_source_43` | `func_00164F80 + 0x64` | New source whose adjacent word replaces finalized lifecycle state. |
| `service_thread_completion_counts_43` | `func_0018C6B4 + 0x5c` | New byte table indexed by the completed thread-like object. |
| `ipc_handle_slot_alpha` | `func_00126414 + 0x60` | Reused primary shared handle slot. |
| `service_absent_result_41_a` | `func_00126414 + 0x64` | Reused result supplied when the primary handle is absent. |
| `service_handle_replacement_41_a` | `func_00126414 + 0x68` | Reused source for the replacement primary handle. |
| `service_wait_handle_42` | `func_00126414 + 0x6c` | Reused secondary shared handle serviced after replacement. |

Consequently:

- reused earlier IPC literal identities: seven;
- new literal identities: three;
- cumulative ordered pool slots: 564;
- cumulative literal identity classes: 282.

## Acceptance contract

An implementation is acceptable only when all of the following hold:

1. It defines exactly the six ARM functions above with the stated body sizes,
   four-byte alignment, global function symbols, and ARM mapping symbols.
2. Each function follows its complete normative mnemonic schedule exactly.
3. The object has exactly the sixteen ordered symbolic branch relocations and
   ten ordered `R_ARM_ABS32` pool relocations listed above.
4. All ten literal sites are distinct classes. The seven named reused
   identities retain their earlier physical identities; the three new
   identities are pairwise distinct and distinct from all earlier classes.
5. The batch extends the cumulative contract from 554 slots / 279 classes to
   exactly 564 slots / 282 classes.
6. The functions remain disjoint from all earlier neutral template manifests.
