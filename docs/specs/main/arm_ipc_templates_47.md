# Probe-verified ARM service/IPC wrappers 47

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
exactly 988 executable bytes. They create and activate transfer objects,
release a counted service handle, drain and finalize a global queue, create a
named session, submit a transfer, and replace an event handle.

The selection is disjoint from every function named by the existing neutral
IPC manifests and from the concurrent duplicate batch 51 reservation. Every
selected function is reported as unmatched in the current target report.

## Function and behavior inventory

All functions and direct destinations are ARM mode and four-byte aligned.
`service_queue_finalize_secondary_47` is a secondary entry without a
standalone function-start row in the neutral inventory.

| Function | Size | Ordered pool slots | Visible behavior |
| --- | ---: | --- | --- |
| `func_00132C20` | 156 | four identities at +0x9c through +0xa8, including reused `service_unlink_context_44` | Normalize transfer size, reject active or misaligned state, create backing storage, initialize transfer state, and map it. |
| `func_00133118` | 140 | three new reference-state identities followed by established `ipc_handle_slot_xi` | Lock shared state, reject an empty count, decrement a reusable count, or close the final owned handle before decrementing. |
| `func_00165490` | 212 | two new identities at +0xd4 and +0xd8 | Lock a global queue, close every queued handle, wait for active work to drain, clear readiness, unlock, and dispatch final cleanup. |
| `func_00165AB0` | 184 | one new service-name identity followed by three established batch-41 identities | Acquire a named service, optionally initialize it, issue a command, close on failure, and publish readiness on success. |
| `func_00178154` | 144 | the three transfer error identities established by `func_00132C20` | Validate transfer state, create backing storage, map it with caller flags, publish success, or undo allocation on failure. |
| `func_00206BA4` | 152 | one new state-error identity at +0x98 | Close an existing event, create and install a replacement, report failures, signal it, and mark the owner active. |

The 18 physical pool slots form 15 distinct identities within this batch.
Five identities reuse established classes; repeated transfer errors account
for three intra-batch aliases. The other 10 identities create new classes.
The cumulative contract is therefore 612 slots in 312 classes.

## Complete normative mnemonic schedules

The schedules are complete and literal. `BEGIN` emits only the standard ARM
section/function header. `END` terminates the executable body; each following
pool belongs to the preceding section but is outside that function's body
size. Labels and directives occupy no executable bytes. Preserve every
mnemonic, operand, register, condition, stack operation, service immediate,
no-op form, local branch destination, and pool order. In particular,
`mov r0,r0` and `nop {0}` are distinct required schedule entries.

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

.global func_00170548,func_001602B8,func_00160380,func_001745F8
.global service_queue_finalize_secondary_47,func_00173E98,func_001706F8
.global func_00174704,func_0017080C,func_0017E47C,func_00178228
.global func_00144D04,func_001603A0
.global service_transfer_active_error_47,service_transfer_alignment_error_47
.global service_unlink_context_44,service_transfer_allocation_error_47
.global service_ref_lock_47,service_ref_count_47,service_ref_empty_marker_47
.global ipc_handle_slot_xi,service_queue_state_47
.global service_queue_finalize_token_47,service_name_47
.global service_owned_handle_41,service_guard_state_41,service_finalize_token_41
.global service_handle_state_error_47

BEGIN func_00132C20
add r2,r2,#3840
add r2,r2,#255
push {r4,r5}
lsr r4,r2,#12
str r1,[r0,#20]
lsl r4,r4,#12
mov r1,r4
pop {r4,r5}
mov r2,r3
mov r0,r0
push {r4,r5,r6,lr}
mov r4,r0
ldr r0,[r0,#8]
mov r5,r2
cmp r0,#0
ldrne r0,.Lpool_00132C20
bne .Lreturn_00132C20
lsls r0,r1,#20
ldrne r0,.Lpool_00132C20+4
bne .Lreturn_00132C20
mov r2,r1
ldr r0,.Lpool_00132C20+8
mov r3,#4096
mov r1,r4
bl func_00170548
movs r1,r0
ldreq r0,.Lpool_00132C20+12
beq .Lreturn_00132C20
cmp r5,#0
strb r5,[r4,#16]
ldr r0,[r4,#20]
movne r2,#1
moveq r2,#3
mov r3,#0x10000000
svc #0x1f
lsrs r1,r0,#31
moveq r1,#1
strbeq r1,[r4,#24]
.Lreturn_00132C20:
pop {r4,r5,r6,pc}
END func_00132C20
.Lpool_00132C20:
.word service_transfer_active_error_47
.word service_transfer_alignment_error_47
.word service_unlink_context_44
.word service_transfer_allocation_error_47

BEGIN func_00133118
push {r4,r5,r6,r7,r8,lr}
ldr r4,.Lpool_00133118
mov r0,r4
bl func_001602B8
ldr r5,.Lpool_00133118+4
mov r7,#0
ldr r0,[r5]
cmp r0,#0
beq .Lempty_00133118
cmp r0,#1
beq .Lclose_00133118
.Ldecrement_00133118:
ldr r0,[r5]
sub r0,r0,#1
str r0,[r5]
mov r5,#0
mov r0,r4
bl func_00160380
mov r0,r5
pop {r4,r5,r6,r7,r8,pc}
.Lempty_00133118:
ldr r5,.Lpool_00133118+8
mov r0,r4
bl func_00160380
mov r0,r5
pop {r4,r5,r6,r7,r8,pc}
.Lclose_00133118:
ldr r6,.Lpool_00133118+12
ldr r0,[r6]
svc #0x23
lsrs r1,r0,#31
streq r7,[r6]
beq .Ldecrement_00133118
mov r5,r0
mov r0,r4
bl func_00160380
mov r0,r5
pop {r4,r5,r6,r7,r8,pc}
END func_00133118
.Lpool_00133118:
.word service_ref_lock_47
.word service_ref_count_47
.word service_ref_empty_marker_47
.word ipc_handle_slot_xi

BEGIN func_00165490
push {r4,r5,r6,r7,r8,lr}
ldr r5,.Lpool_00165490
mov r0,r5
bl func_001745F8
add r6,r5,#16
mov r0,r6
bl func_001602B8
ldr r4,[r5,#4]
mov r7,#0
cmp r4,#0
beq .Lwait_00165490
.Lclose_loop_00165490:
ldr r0,[r4,#8]
add r8,r4,#8
cmp r0,#0
beq .Lnext_00165490
svc #0x23
str r7,[r8]
.Lnext_00165490:
ldr r0,[r5,#4]
mov r1,r4
cmp r0,#0
ldrne r0,[r0]
cmp r0,r4
ldrne r4,[r1,#4]
cmpne r4,#0
bne .Lclose_loop_00165490
.Lwait_00165490:
ldr r0,[r5,#36]
cmp r0,#0
beq .Lfinish_00165490
add r0,r5,#16
bl func_00160380
ldr r0,.Lpool_00165490+4
mov r1,#0
bl service_queue_finalize_secondary_47
add r0,r5,#16
nop {0}
bl func_001602B8
nop {0}
nop {0}
b .Lwait_00165490
.Lfinish_00165490:
mov r0,r6
strb r7,[r5,#65]
bl func_00160380
mov r0,r5
nop {0}
bl func_001745F8
ldr r0,[r5,#72]
ldr r1,[r5,#68]
ldr r2,[r0]
ldr r2,[r2,#4]
blx r2
str r7,[r5,#68]
str r7,[r5,#72]
pop {r4,r5,r6,r7,r8,pc}
END func_00165490
.Lpool_00165490:
.word service_queue_state_47
.word service_queue_finalize_token_47

BEGIN func_00165AB0
push {r4,r5,r6,lr}
mov r5,r0
mov r4,r1
ldr r1,.Lpool_00165AB0
ldr r0,.Lpool_00165AB0+4
sub sp,sp,#8
bl func_00173E98
lsrs r1,r0,#31
bne .Lreturn_00165AB0
ldr r6,.Lpool_00165AB0+8
cmp r4,#0
ldr r0,[r6,#4]
str r0,[sp,#4]
beq .Lcommand_00165AB0
mov r0,#3
str r0,[sp]
ldr r0,.Lpool_00165AB0+12
mov r3,#0
mov r2,r4
mov r1,r5
bl func_001706F8
.Lcommand_00165AB0:
ldr r0,.Lpool_00165AB0+12
mov r2,r4
ldr r1,[r0,#20]
add r0,sp,#4
bl func_00174704
mov r5,r0
ands r0,r0,#0x80000000
bpl .Lsuccess_00165AB0
ldr r4,.Lpool_00165AB0+4
ldr r0,[r4]
cmp r0,#0
beq .Lfinalize_00165AB0
svc #0x23
mov r0,#0
str r0,[r4]
.Lfinalize_00165AB0:
ldr r0,.Lpool_00165AB0+12
bl func_0017080C
mov r0,r5
.Lreturn_00165AB0:
add sp,sp,#8
pop {r4,r5,r6,pc}
.Lsuccess_00165AB0:
mov r0,#1
strb r0,[r6]
add sp,sp,#8
mov r0,#0
pop {r4,r5,r6,pc}
END func_00165AB0
.Lpool_00165AB0:
.word service_name_47
.word service_owned_handle_41
.word service_guard_state_41
.word service_finalize_token_41

BEGIN func_00178154
push {r4,r5,r6,r7,r8,lr}
mov ip,r1
lsls r1,r2,#20
ldr r5,[sp,#24]
ldrne r0,.Lpool_00178154
bne .Lreturn_00178154
mov r4,r0
str ip,[r0,#20]
ldr r0,[r0,#8]
mov r1,r2
mov r6,r3
cmp r0,#0
ldrne r0,.Lpool_00178154+4
bne .Lreturn_00178154
mov r0,r4
bl func_0017E47C
movs r1,r0
ldreq r0,.Lpool_00178154+8
beq .Lreturn_00178154
mov r7,#1
bic r0,r7,r5,lsr #1
strb r0,[r4,#16]
ldr r0,[r4,#20]
mov r3,r6
mov r2,r5
svc #0x1f
mov r5,r0
and r0,r0,#0x80000000
cmp r0,#0
movge r0,r5
strbge r7,[r4,#24]
bge .Lreturn_00178154
mov r0,r4
bl func_00178228
mov r0,r5
.Lreturn_00178154:
pop {r4,r5,r6,r7,r8,pc}
END func_00178154
.Lpool_00178154:
.word service_transfer_alignment_error_47
.word service_transfer_active_error_47
.word service_transfer_allocation_error_47

BEGIN func_00206BA4
push {r3,r4,r5,r6,r7,lr}
mov r4,r0
mov r6,#0
ldrb r0,[r0,#284]
cmp r0,#0
beq .Lcreate_00206BA4
ldr r0,[r4,#280]
add r5,r4,#280
cmp r0,#0
beq .Lcreate_00206BA4
svc #0x23
str r6,[r5]
.Lcreate_00206BA4:
str r6,[sp]
ldr r0,[r4,#280]
mov r1,#0
add r5,r4,#280
cmp r0,#0
ldrne r0,.Lpool_00206BA4
bne .Lreport_create_00206BA4
mov r0,sp
bl func_00144D04
lsrs r1,r0,#31
nop {0}
bne .Lreport_create_00206BA4
ldr r1,[sp]
mov r0,#0
str r1,[r5]
.Lreport_create_00206BA4:
lsrs r1,r0,#31
blne func_001603A0
ldr r0,[r4,#280]
nop {0}
svc #0x19
lsrs r1,r0,#31
nop {0}
blne func_001603A0
mov r0,#1
strb r0,[r4,#284]
pop {r3,r4,r5,r6,r7,pc}
END func_00206BA4
.Lpool_00206BA4:
.word service_handle_state_error_47
```

## Relocation and identity contract

- Emit exactly the branch relocations listed in the companion manifest, at
  the listed body offsets and with the listed relocation kinds.
- Every listed primary destination is a standalone ARM function entry. The
  named secondary destination is a distinct aligned entry without its own
  inventory row.
- Emit one `R_ARM_ABS32` relocation for every ordered pool slot. Slots sharing
  a symbolic identity must share one undefined symbol; all other identity
  classes are pairwise distinct.
- The five established literal identities must retain their earlier names.
- No private literal value is part of this specification.
